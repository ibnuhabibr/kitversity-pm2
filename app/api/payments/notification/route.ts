import { NextResponse } from 'next/server';
import { handleMidtransNotification } from '@/lib/midtrans';
import { OrderModel, PaymentModel } from '@/lib/db/models';
import { z } from 'zod';

// Schema validasi untuk notifikasi Midtrans
const notificationSchema = z.object({
  transaction_status: z.string(),
  order_id: z.string(),
  payment_type: z.string(),
  gross_amount: z.string(),
  settlement_time: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const notification = await request.json();
    
    // Validasi notifikasi
    const validatedData = notificationSchema.parse(notification);
    
    // Handle notifikasi
    const paymentInfo = await handleMidtransNotification(validatedData);
    
    // Get order
    const order = await OrderModel.findById(parseInt(paymentInfo.orderId));
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get payment
    const payment = await PaymentModel.findByOrderId(order.id);
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update payment status
    let paymentStatus = 'pending';
    let orderStatus = order.status;

    switch (paymentInfo.status) {
      case 'capture':
      case 'settlement':
        paymentStatus = 'completed';
        orderStatus = 'processing';
        break;
      case 'deny':
      case 'cancel':
      case 'expire':
        paymentStatus = 'failed';
        orderStatus = 'cancelled';
        break;
      case 'pending':
        paymentStatus = 'processing';
        break;
    }

    // Update payment
    await PaymentModel.updateStatus(
      payment.id,
      paymentStatus,
      paymentInfo.paidAt ? new Date(paymentInfo.paidAt) : undefined
    );

    // Update order status
    await OrderModel.updateStatus(order.id, orderStatus);

    // TODO: Implementasi notifikasi
    // - Email notification
    // - WhatsApp notification
    // - In-app notification

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling payment notification:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid notification data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to handle payment notification' },
      { status: 500 }
    );
  }
} 