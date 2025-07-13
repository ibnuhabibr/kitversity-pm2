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
  specifications?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  image_url?: string;
  category?: string;
  rating: number;
  sold: number;
<<<<<<< HEAD
  variants?: string; 
=======
  variants?: string; // <-- TAMBAHKAN INI
>>>>>>> 45e8a62a7999f3e68c1eee3cb4fc65ace4bda797
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: number;
  user_id: number | null;
  total_amount: number;
  status: string;
  shipping_address: string;
  shipping_method: string;
<<<<<<< HEAD
  payment_method: string;
=======
  payment_method: string; // Diubah ke string agar lebih fleksibel
>>>>>>> 45e8a62a7999f3e68c1eee3cb4fc65ace4bda797
  customer_info: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
<<<<<<< HEAD
  // --- REVISI DI SINI ---
  // Menambahkan properti untuk menyimpan detail produk seperti ukuran, warna, dll.
  product_details: string | null; // Disimpan sebagai string JSON
  // --- AKHIR REVISI ---
  created_at: Date;
}

=======
  created_at: Date;
}

// --- TIPE ENUM DIPERBARUI DI SINI ---
>>>>>>> 45e8a62a7999f3e68c1eee3cb4fc65ace4bda797
export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  payment_method: 'bank_transfer' | 'virtual_account_bca' | 'virtual_account_bri' | 'virtual_account_bni' | 'virtual_account_mandiri' | 'shopeepay' | 'gopay' | 'qris';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
  midtrans_token?: string;
  midtrans_redirect_url?: string;
  paid_at?: Date;
  created_at: Date;
  updated_at: Date;
<<<<<<< HEAD
}
=======
}
>>>>>>> 45e8a62a7999f3e68c1eee3cb4fc65ace4bda797
