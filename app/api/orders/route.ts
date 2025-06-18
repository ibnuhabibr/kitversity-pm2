import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { CreateOrderRequest, OrderResponse, Order } from '@/types/order';
import { createPayment } from '@/lib/midtrans';

// In-memory storage for orders (replace with database in production)
const orders = new Map<string, Order>();

export async function POST(request: Request) {
  try {
    const body: CreateOrderRequest = await request.json();
    
    // Generate unique order ID
    const orderId = `ORDER-${uuidv4()}`;
    
    // Calculate total amount
    const totalAmount = body.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order object
    const order: Order = {
      id: orderId,
      items: body.items,
      customerInfo: body.customerInfo,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store order
    orders.set(orderId, order);

    // Create payment with Midtrans
    const payment = await createPayment(
      orderId,
      totalAmount,
      body.items,
      body.customerInfo,
      body.paymentMethod
    );

    // Update order with payment info
    order.paymentInfo = {
      method: body.paymentMethod,
      status: 'pending',
      token: payment.token,
      redirectUrl: payment.redirectUrl
    };
    orders.set(orderId, order);

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

    // Return all orders (in production, implement pagination)
    const allOrders = Array.from(orders.values());
    return NextResponse.json({ orders: allOrders });
  } catch (error) {
    console.error('Error retrieving orders:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve orders' },
      { status: 500 }
    );
  }
} 