# Kitversity Payment System

This project implements a payment system using Midtrans as the payment gateway. The system allows users to make payments using various methods including bank transfers, e-wallets, and QRIS.

## Features

- Multiple payment methods:
  - Bank Transfer
  - GoPay
  - ShopeePay
  - QRIS
- Secure payment processing
- Real-time payment status updates
- Order tracking
- Email and WhatsApp notifications
- Responsive design for all devices

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the project root with the following variables:
```
MIDTRANS_SERVER_KEY=your-server-key
MIDTRANS_CLIENT_KEY=your-client-key
NODE_ENV=development
```

3. Get your Midtrans credentials:
- Sign up for a Midtrans account at https://dashboard.midtrans.com/
- Get your server key and client key from the dashboard
- Replace the placeholder values in `.env.local` with your actual keys

## Development

Run the development server:
```bash
npm run dev
```

## Payment Flow

1. User adds items to cart
2. User proceeds to checkout
3. User fills in customer information
4. User selects payment method
5. System creates order and payment
6. User is redirected to Midtrans payment page
7. User completes payment
8. System receives payment notification
9. Order status is updated
10. User receives confirmation

## API Endpoints

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders?id=<order_id>` - Get order details
- `GET /api/orders` - Get all orders

### Payments
- `POST /api/payments/notification` - Handle Midtrans payment notifications

## Pages

- `/checkout` - Checkout page with customer information and payment method selection
- `/checkout/success` - Payment success page
- `/checkout/failed` - Payment failed page
- `/orders/[id]` - Order details page

## Components

- `CheckoutPage` - Main checkout form
- `OrderDetailsPage` - Order information and status
- `SuccessPage` - Payment success confirmation
- `FailedPage` - Payment failure handling

## Security

- All payment processing is handled by Midtrans
- No sensitive payment information is stored in the application
- HTTPS is required for all payment-related operations
- Environment variables are used for sensitive configuration

## Testing

For testing payments, use Midtrans sandbox environment:
1. Set `NODE_ENV=development` in `.env.local`
2. Use sandbox credentials from Midtrans dashboard
3. Use test card numbers and accounts provided by Midtrans

## Production

For production deployment:
1. Set `NODE_ENV=production` in `.env.local`
2. Use production credentials from Midtrans dashboard
3. Ensure all security measures are in place
4. Set up proper error monitoring and logging

## Support

For issues related to:
- Midtrans integration: Contact Midtrans support
- Application issues: Open an issue in this repository 