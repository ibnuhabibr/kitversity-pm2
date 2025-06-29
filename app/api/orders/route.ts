// Lokasi: app/api/orders/route.ts

import { NextResponse } from 'next/server';
import { z } from 'zod';
import pool from '@/lib/db/config';
import type { Order as DbOrder } from '@/types/database';
import type { Order as FrontendOrder } from '@/types/order';
import type { PoolConnection } from 'mysql2/promise';

const createOrderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().min(1),
    image: z.string().optional(),
    selectedVariants: z.record(z.string()).optional(),
  })).min(1),
  customerInfo: z.object({
    name: z.string().min(3, "Nama harus diisi"),
    email: z.string().email("Email tidak valid"),
    phone: z.string().min(10, "Nomor telepon tidak valid"),
    address: z.string().optional(),
  }),
  paymentMethod: z.enum(['bank_transfer', 'qris']),
});

function transformDbOrderToFrontend(dbOrder: DbOrder, items: any[] = []): FrontendOrder {
    try {
        const customerInfo = typeof dbOrder.customer_info === 'string' 
            ? JSON.parse(dbOrder.customer_info) 
            : dbOrder.customer_info;
        
        return {
            id: String(dbOrder.id),
            items: items,
            customerInfo: customerInfo,
            totalAmount: Number(dbOrder.total_amount),
            status: dbOrder.status,
            paymentStatus: dbOrder.status,
            paymentMethod: dbOrder.payment_method as any,
            createdAt: new Date(dbOrder.created_at).toISOString(),
            updatedAt: new Date(dbOrder.updated_at).toISOString(),
        };
    } catch (e) {
        console.error("Failed to parse customer_info:", dbOrder.customer_info);
        return {
            id: String(dbOrder.id),
            items: items,
            customerInfo: { name: 'Error', email: 'Error', phone: 'Error' },
            totalAmount: Number(dbOrder.total_amount),
            status: dbOrder.status,
            paymentStatus: dbOrder.status,
            paymentMethod: dbOrder.payment_method as any,
            createdAt: new Date(dbOrder.created_at).toISOString(),
            updatedAt: new Date(dbOrder.updated_at).toISOString(),
        };
    }
}

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
    if (!orderId) {
      throw new Error('Gagal membuat pesanan di database.');
    }

    // --- PERBAIKAN DI SINI ---
    // Tambahkan pengecekan ini untuk meyakinkan TypeScript
    if (!connection) {
        throw new Error('Koneksi database hilang sebelum memproses item pesanan.');
    }

    const orderItemsPromises = items.map(item => {
        const productId = parseInt(item.id, 10);
        // Sekarang TypeScript yakin 'connection' tidak undefined di sini
        return connection.execute(
            `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
            [orderId, productId, item.quantity, item.price]
        );
    });
    
    await Promise.all(orderItemsPromises);
    await connection.commit();

    const [orderRows] = await pool.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
    const newDbOrder = (orderRows as any)[0];
    
    const frontendOrder = transformDbOrderToFrontend(newDbOrder, items);

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

export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const orderId = searchParams.get('id');
  
      if (orderId) {
        const [orderRows] = await pool.execute('SELECT * FROM orders WHERE id = ?', [parseInt(orderId, 10)]);
        const dbOrder = (orderRows as any)[0];
        
        if (!dbOrder) {
          return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
        }

        const [itemRows] = await pool.execute('SELECT * FROM order_items WHERE order_id = ?', [dbOrder.id]);
        
        const frontendOrder = transformDbOrderToFrontend(dbOrder, itemRows as any[]);
  
        return NextResponse.json({ order: frontendOrder });
      }
  
      const [allOrderRows] = await pool.execute('SELECT * FROM orders ORDER BY created_at DESC');
      const allFrontendOrders = (allOrderRows as any[]).map(order => transformDbOrderToFrontend(order));
      return NextResponse.json({ orders: allFrontendOrders });
  
    } catch (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ error: 'Gagal mengambil data pesanan' }, { status: 500 });
    }
}