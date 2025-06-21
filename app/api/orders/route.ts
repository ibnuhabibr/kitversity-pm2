import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { CreateOrderRequest, OrderResponse, Order, PaymentMethod } from '@/types/order';
import { z } from 'zod';
import { createPayment } from '@/lib/midtrans';

// Schema validasi untuk request
const createOrderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().min(1),
    image: z.string()
  })),
  customerInfo: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    phone: z.string().min(10),
    address: z.string().optional()
  }),
  paymentMethod: z.enum(['bank_transfer', 'gopay', 'shopeepay', 'qris', 'virtual_account'])
});

// In-memory storage untuk orders (bisa diganti dengan database nanti)
const orders = new Map<string, Order>();

export async function POST(request: Request) {
  try {
    const body: CreateOrderRequest = await request.json();
    
    // Validasi request
    const validatedData = createOrderSchema.parse(body);
    
    // Generate unique order ID
    const orderId = `ORDER-${uuidv4()}`;
    
    // Hitung total amount
    const totalAmount = validatedData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Buat order
    const order: Order = {
      id: orderId,
      items: validatedData.items,
      customerInfo: validatedData.customerInfo,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: validatedData.paymentMethod as PaymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Simpan order
    orders.set(orderId, order);

    // Buat payment dengan Midtrans
    const payment = await createPayment(
      orderId,
      totalAmount,
      validatedData.items,
      validatedData.customerInfo,
      validatedData.paymentMethod as PaymentMethod
    );

    const response: OrderResponse = {
      order,
      payment: {
        token: payment.token,
        redirectUrl: payment.redirectUrl
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating order:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (orderId) {
      const order = orders.get(orderId);
      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ order });
    }

    // Return all orders
    const allOrders = Array.from(orders.values());
    return NextResponse.json({ orders: allOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// Helper function untuk format harga
function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
} 