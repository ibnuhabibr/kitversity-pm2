// Lokasi: types/database.ts

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  university?: string;
  address?: string;
  role: 'admin' | 'user';
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
  category?: string;
  created_at: Date;
  updated_at: Date;
}

// PERBAIKAN DI SINI
export interface Order {
  id: number;
  user_id: number | null; // user_id bisa null
  total_amount: number;
  status: string; // Ubah ke string agar lebih fleksibel
  shipping_address: string;
  shipping_method: string;
  payment_method: 'bank_transfer' | 'qris'; // Tambahkan ini
  customer_info: string; // Tambahkan ini (sebagai string karena dari DB dibaca sbg JSON string)
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: Date;
}

export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  payment_method: 'bank_transfer' | 'gopay' | 'shopeepay' | 'qris' | 'virtual_account';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
  midtrans_token?: string;
  midtrans_redirect_url?: string;
  paid_at?: Date;
  created_at: Date;
  updated_at: Date;
}