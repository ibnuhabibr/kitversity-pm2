import { PaymentMethod, OrderItem, CustomerInfo } from '@/types/order';

// Midtrans configuration
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;
const MIDTRANS_IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Midtrans API URLs
const MIDTRANS_API_URL = MIDTRANS_IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/v1/transactions'
  : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

// Convert payment method to Midtrans payment type
const getMidtransPaymentType = (method: PaymentMethod): string => {
  switch (method) {
    case 'bank_transfer':
      return 'bank_transfer';
    case 'gopay':
      return 'gopay';
    case 'shopeepay':
      return 'shopeepay';
    case 'qris':
      return 'qris';
    case 'virtual_account':
      return 'bank_transfer';
    default:
      throw new Error('Invalid payment method');
  }
};

// Create transaction details for Midtrans
const createTransactionDetails = (
  orderId: string,
  amount: number,
  items: OrderItem[]
) => {
  return {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount
    },
    item_details: items.map(item => ({
      id: item.productId,
      price: item.price,
      quantity: item.quantity,
      name: item.name
    }))
  };
};

// Create customer details for Midtrans
const createCustomerDetails = (customer: CustomerInfo) => {
  return {
    customer_details: {
      first_name: customer.name,
      email: customer.email,
      phone: customer.phone,
      billing_address: {
        address: customer.address
      }
    }
  };
};

// Create payment request to Midtrans
export const createPayment = async (
  orderId: string,
  amount: number,
  items: OrderItem[],
  customer: CustomerInfo,
  paymentMethod: PaymentMethod
) => {
  try {
    const response = await fetch(MIDTRANS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64')}`
      },
      body: JSON.stringify({
        ...createTransactionDetails(orderId, amount, items),
        ...createCustomerDetails(customer),
        payment_type: getMidtransPaymentType(paymentMethod),
        enabled_payments: [getMidtransPaymentType(paymentMethod)]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create payment');
    }

    const data = await response.json();
    return {
      token: data.token,
      redirectUrl: data.redirect_url,
      orderId: data.order_id
    };
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

// Verify payment status from Midtrans
export const verifyPayment = async (orderId: string) => {
  try {
    const response = await fetch(`${MIDTRANS_API_URL}/${orderId}/status`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to verify payment');
    }

    const data = await response.json();
    return {
      status: data.transaction_status,
      paymentType: data.payment_type,
      paidAt: data.settlement_time,
      amount: data.gross_amount
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

// Handle Midtrans notification
export const handleMidtransNotification = async (notification: any) => {
  try {
    const {
      transaction_status,
      order_id,
      payment_type,
      gross_amount,
      settlement_time
    } = notification;

    // Verify the notification
    const verification = await verifyPayment(order_id);
    
    if (verification.status !== transaction_status) {
      throw new Error('Payment status mismatch');
    }

    return {
      orderId: order_id,
      status: transaction_status,
      paymentType: payment_type,
      amount: gross_amount,
      paidAt: settlement_time
    };
  } catch (error) {
    console.error('Error handling notification:', error);
    throw error;
  }
}; 