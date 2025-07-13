// Lokasi: app/api/orders/route.ts

import { NextResponse } from 'next/server';
import { z } from 'zod';
import pool from '@/lib/db/config';
import { OrderModel, OrderItemModel } from '@/lib/db/models';
import type { Order as DbOrder, OrderItem as DbOrderItem } from '@/types/database';
import type { Order as FrontendOrder, OrderItem as FrontendOrderItem } from '@/types/order';
import type { PoolConnection } from 'mysql2/promise';

// Skema validasi diperbarui untuk menerima selectedVariants
const createOrderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().min(1),
    image: z.string().optional(),
    selectedVariants: z.record(z.string()).optional(), // Menerima varian yang dipilih
  })).min(1),
  customerInfo: z.object({
    name: z.string().min(3, "Nama harus diisi"),
    email: z.string().email("Email tidak valid"),
    phone: z.string().min(10, "Nomor telepon tidak valid"),
    address: z.string().optional(),
  }),
  paymentMethod: z.enum([
    'bank_transfer', 'virtual_account_bca', 'virtual_account_bri',
    'virtual_account_bni', 'virtual_account_mandiri', 'shopeepay', 'gopay', 'qris'
  ]),
});


// Fungsi untuk mengubah format data dari database ke format frontend
function transformDbOrderToFrontend(dbOrder: DbOrder, items: DbOrderItem[] = []): FrontendOrder {
    try {
        const customerInfo = typeof dbOrder.customer_info === 'string'
            ? JSON.parse(dbOrder.customer_info)
            : dbOrder.customer_info;

        return {
            id: String(dbOrder.id),
            // --- REVISI DI SINI: Menyertakan product_details ---
            items: items.map(item => ({
                id: String(item.product_id),
                name: (item as any).name, // Asumsi 'name' di-join dari tabel products
                price: Number(item.price),
                quantity: item.quantity,
                image: (item as any).image_url, // Asumsi 'image_url' di-join
                product_details: item.product_details, // Menyertakan detail produk
            })),
            // --- AKHIR REVISI ---
            customerInfo: customerInfo,
            totalAmount: Number(dbOrder.total_amount),
            status: dbOrder.status,
            paymentStatus: dbOrder.status,
            paymentMethod: dbOrder.payment_method as any,
            shippingMethod: dbOrder.shipping_method,
            shippingAddress: dbOrder.shipping_address,
            createdAt: new Date(dbOrder.created_at).toISOString(),
            updatedAt: new Date(dbOrder.updated_at).toISOString(),
        };
    } catch (e) {
        console.error("Gagal mem-parsing customer_info:", dbOrder.customer_info, e);
        return {
            id: String(dbOrder.id), items: [], customerInfo: { name: 'Error Parsing', email: 'Error', phone: 'Error' },
            totalAmount: Number(dbOrder.total_amount), status: 'error', paymentStatus: 'error',
            paymentMethod: 'bank_transfer', shippingMethod: 'Error', shippingAddress: 'Error',
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        };
    }
}

// --- FUNGSI POST DIPERBARUI UNTUK MENYIMPAN VARIAN ---
export async function POST(request: Request) {
  let connection: PoolConnection | undefined;
  
  try {
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);
    const { items, customerInfo, paymentMethod } = validatedData;
    
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (total_amount, status, shipping_address, payment_method, customer_info) VALUES (?, ?, ?, ?, ?)`,
      [totalAmount, 'pending-payment', customerInfo.address || 'COD Kampus UNAIR', paymentMethod, JSON.stringify(customerInfo)]
    );
    
    const orderId = (orderResult as any).insertId;
    if (!orderId) throw new Error('Gagal membuat pesanan di database.');
    if (!connection) throw new Error('Koneksi database hilang.');
    
    const db = connection;

    // --- REVISI DI SINI: Menyimpan varian ke database ---
    const orderItemsPromises = items.map(item => {
        const productId = parseInt(item.id, 10);
        const productDetails = item.selectedVariants && Object.keys(item.selectedVariants).length > 0 
            ? JSON.stringify(item.selectedVariants) 
            : null;

        return db.execute(
            `INSERT INTO order_items (order_id, product_id, quantity, price, product_details) VALUES (?, ?, ?, ?, ?)`,
            [orderId, productId, item.quantity, item.price, productDetails]
        );
    });
    // --- AKHIR REVISI ---
    
    await Promise.all(orderItemsPromises);
    await connection.commit();

    const [orderRows] = await pool.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
    const newDbOrder = (orderRows as any)[0];
    
    // Ambil kembali item yang baru saja disimpan untuk memastikan data konsisten
    const newOrderItems = await OrderItemModel.findByOrderId(orderId);
    const frontendOrder = transformDbOrderToFrontend(newDbOrder, newOrderItems);

    return NextResponse.json({ order: frontendOrder });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error saat membuat pesanan:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Data tidak valid', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Gagal membuat pesanan', details: (error as Error).message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

// --- FUNGSI GET DIPERBARUI UNTUK MENGAMBIL VARIAN ---
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (orderId) {
      const dbOrder = await OrderModel.findById(Number(orderId));
      if (!dbOrder) {
        return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
      }
      
      // Ambil semua item yang berhubungan dengan pesanan ini, termasuk detailnya
      const orderItems = await OrderItemModel.findByOrderId(dbOrder.id);
      const frontendOrder = transformDbOrderToFrontend(dbOrder, orderItems);
      return NextResponse.json({ order: frontendOrder });
    }

    const allDbOrders = await OrderModel.findAll();
    // Untuk daftar semua pesanan, kita bisa mengambil item juga jika diperlukan,
    // tapi untuk saat ini kita biarkan kosong agar lebih cepat.
    const allFrontendOrders = await Promise.all(allDbOrders.map(async (order) => {
        const items = await OrderItemModel.findByOrderId(order.id);
        return transformDbOrderToFrontend(order, items);
    }));
    return NextResponse.json({ orders: allFrontendOrders });

  } catch (error) {
    console.error('Gagal mengambil data pesanan:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan di server' }, { status: 500 });
  }
}
