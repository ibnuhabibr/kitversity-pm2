import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { CreateOrderRequest, Order as FrontendOrder } from '@/types/order';
import { OrderModel, OrderItemModel } from '@/lib/db/models';
import type { Order as DbOrder } from '@/types/database'; // Tipe untuk data dari DB

const createOrderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().min(1),
    image: z.string().optional(),
  })).min(1),
  customerInfo: z.object({
    name: z.string().min(3, { message: "Nama harus diisi" }),
    email: z.string().email({ message: "Email tidak valid" }),
    phone: z.string().min(10, { message: "Nomor telepon tidak valid" }),
    address: z.string().optional(),
  }),
  paymentMethod: z.enum(['bank_transfer', 'qris']),
});

// Fungsi helper untuk mengubah data dari format DB ke format frontend
function transformDbOrderToFrontend(dbOrder: DbOrder, items: any[] = []): FrontendOrder {
  return {
    id: String(dbOrder.id),
    items: items,
    customerInfo: JSON.parse(dbOrder.customer_info || '{}'),
    totalAmount: Number(dbOrder.total_amount),
    status: dbOrder.status,
    paymentStatus: dbOrder.status, // Kita asumsikan sama dengan status order
    paymentMethod: dbOrder.payment_method as any,
    createdAt: new Date(dbOrder.created_at).toISOString(),
    updatedAt: new Date(dbOrder.updated_at).toISOString(),
  };
}

export async function POST(request: Request) {
  try {
    const body: CreateOrderRequest = await request.json();
    const validatedData = createOrderSchema.parse(body);
    const { items, customerInfo, paymentMethod } = validatedData;

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newDbOrder = await OrderModel.create({
      user_id: null,
      total_amount: totalAmount,
      status: 'pending-payment',
      shipping_address: customerInfo.address || 'Tidak ada alamat',
      shipping_method: 'standard',
      payment_method: paymentMethod,
      customer_info: JSON.stringify(customerInfo),
    });

    if (!newDbOrder || !newDbOrder.id) {
      throw new Error('Gagal membuat pesanan di database.');
    }

    for (const item of items) {
      const productId = parseInt(item.id, 10);
      if (isNaN(productId)) continue;
      await OrderItemModel.create({
        order_id: newDbOrder.id,
        product_id: productId,
        quantity: item.quantity,
        price: item.price,
      });
    }

    // Transformasi data sebelum dikirim sebagai response
    const frontendOrder = transformDbOrderToFrontend(newDbOrder);

    return NextResponse.json({ order: frontendOrder });

  } catch (error) {
    console.error('Error saat membuat pesanan:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Data tidak valid', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Gagal membuat pesanan', details: (error as Error).message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (orderId) {
      const dbOrder = await OrderModel.findById(parseInt(orderId, 10));
      if (!dbOrder) {
        return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
      }
      const orderItems = await OrderItemModel.findByOrderId(dbOrder.id);
      
      // Transformasi data sebelum dikirim sebagai response
      const frontendOrder = transformDbOrderToFrontend(dbOrder, orderItems);

      return NextResponse.json({ order: frontendOrder });
    }

    const allDbOrders = await OrderModel.findAll();
    const allFrontendOrders = allDbOrders.map(order => transformDbOrderToFrontend(order));
    return NextResponse.json({ orders: allFrontendOrders });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Gagal mengambil data pesanan' }, { status: 500 });
  }
}
