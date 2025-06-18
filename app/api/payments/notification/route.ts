import { NextResponse } from 'next/server';
import { handleMidtransNotification } from '@/lib/midtrans';

// In-memory storage for orders (replace with database in production)
const orders = new Map();

export async function POST(request: Request) {
  try {
    const notification = await request.json();
    
    // Handle the notification
    const paymentInfo = await handleMidtransNotification(notification);
    
    // Get the order
    const order = orders.get(paymentInfo.orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order status based on payment status
    switch (paymentInfo.status) {
      case 'capture':
      case 'settlement':
        order.status = 'processing';
        order.paymentStatus = 'completed';
        order.paymentInfo = {
          ...order.paymentInfo,
          status: 'completed',
          paidAt: paymentInfo.paidAt
        };
        break;
      case 'deny':
      case 'cancel':
      case 'expire':
        order.status = 'cancelled';
        order.paymentStatus = 'failed';
        order.paymentInfo = {
          ...order.paymentInfo,
          status: 'failed'
        };
        break;
      case 'pending':
        order.paymentStatus = 'processing';
        order.paymentInfo = {
          ...order.paymentInfo,
          status: 'processing'
        };
        break;
    }

    // Update order
    orders.set(paymentInfo.orderId, order);

    // TODO: Send notifications to customer and admin
    // - Email notification
    // - WhatsApp notification
    // - In-app notification

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling payment notification:', error);
    return NextResponse.json(
      { error: 'Failed to handle payment notification' },
      { status: 500 }
    );
  }
} 