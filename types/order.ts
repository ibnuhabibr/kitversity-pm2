// Lokasi: types/order.ts

import { Product } from '@/contexts/CartContext';

<<<<<<< HEAD
=======
// --- TIPE DIPERBARUI DI SINI ---
>>>>>>> 45e8a62a7999f3e68c1eee3cb4fc65ace4bda797
export type PaymentMethod = 
  | 'bank_transfer'
  | 'virtual_account_bca'
  | 'virtual_account_bri'
  | 'virtual_account_bni'
  | 'virtual_account_mandiri'
  | 'shopeepay'
  | 'gopay'
  | 'qris';

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
<<<<<<< HEAD
  // --- REVISI DI SINI ---
  // Menambahkan properti untuk membawa detail produk dari backend ke frontend.
  product_details: string | null; // Akan berisi string JSON dari varian
  // --- AKHIR REVISI ---
=======
>>>>>>> 45e8a62a7999f3e68c1eee3cb4fc65ace4bda797
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: PaymentMethod;
  shippingMethod?: string; 
  shippingAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  customerInfo: CustomerInfo;
  paymentMethod: PaymentMethod;
<<<<<<< HEAD
}
=======
}
>>>>>>> 45e8a62a7999f3e68c1eee3cb4fc65ace4bda797
