import { Product } from '@/contexts/CartContext';

export type PaymentMethod = 
  | 'bank_transfer'
  | 'gopay'
  | 'shopeepay'
  | 'qris'
  | 'virtual_account';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'expired';

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  token?: string;
  redirectUrl?: string;
  paidAt?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  customerInfo: CustomerInfo;
  paymentMethod: PaymentMethod;
}

export interface OrderResponse {
  order: Order;
  payment: {
    token: string;
    redirectUrl: string;
  };
} 