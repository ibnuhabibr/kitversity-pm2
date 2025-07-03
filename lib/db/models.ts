// Lokasi: lib/db/models.ts

import pool from './config';
import { Order, OrderItem, Payment, User, Product } from '@/types/database';
import type { ResultSetHeader } from 'mysql2/promise';

// Helper untuk mengambil baris pertama dari hasil query
function getFirstRow<T>(rows: any): T | undefined {
  if (Array.isArray(rows) && rows.length > 0) {
    return rows[0] as T;
  }
  return undefined;
}

// UserModel tetap sama
export const UserModel = {
  async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User | undefined> {
    const { name, email, phone, university, address, role } = user;
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO users (name, email, phone, university, address, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, phone, university, address, role || 'user']
    );
    return this.findById(result.insertId);
  },

  async findById(id: number): Promise<User | undefined> {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return getFirstRow<User>(rows);
  },

  async findByEmail(email: string): Promise<User | undefined> {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return getFirstRow<User>(rows);
  }
};

// --- Product Model DIPERBARUI TOTAL ---
export const ProductModel = {
  async create(product: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<Product | undefined> {
    const {
        name, description, specifications, price, originalPrice,
        discount, stock, image_url, category, rating = 5.0, sold = 0, variants
    } = product;

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO products (
        name, description, specifications, price, originalPrice,
        discount, stock, image_url, category, rating, sold, variants
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, description, specifications, price, originalPrice,
        discount, stock, image_url, category, rating, sold, variants
      ]
    );
    return this.findById(result.insertId);
  },

  async findById(id: number): Promise<Product | undefined> {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return getFirstRow<Product>(rows);
  },

  async findAll(): Promise<Product[]> {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');
    return rows as Product[];
  },

  async update(id: number, product: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<Product | undefined> {
    const existingProduct = await this.findById(id);
    if (!existingProduct) {
        throw new Error("Produk tidak ditemukan untuk diupdate");
    }

    const dataToUpdate = { ...existingProduct, ...product };

    const {
        name, description, specifications, price, originalPrice, discount,
        stock, image_url, category, rating, sold, variants
    } = dataToUpdate;

    await pool.query(
        `UPDATE products SET
            name = ?, description = ?, specifications = ?, price = ?, originalPrice = ?,
            discount = ?, stock = ?, image_url = ?, category = ?, rating = ?,
            sold = ?, variants = ?
         WHERE id = ?`,
        [
            name, description, specifications, price, originalPrice, discount,
            stock, image_url, category, rating, sold, variants, id
        ]
    );
    return this.findById(id);
  },

  async deleteById(id: number): Promise<boolean> {
      const [result] = await pool.query<ResultSetHeader>(
          'DELETE FROM products WHERE id = ?',
          [id]
      );
      return result.affectedRows > 0;
  }
};

// ... (OrderModel dan model lainnya tidak berubah)
export const OrderModel = {
  async create(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | undefined> {
    const { user_id, total_amount, status, shipping_address, shipping_method, payment_method, customer_info } = order;
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO orders (user_id, total_amount, status, shipping_address, shipping_method, payment_method, customer_info)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, total_amount, status, shipping_address, shipping_method, payment_method, customer_info]
    );
    return this.findById(result.insertId);
  },

  async findById(id: number): Promise<Order | undefined> {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    return getFirstRow<Order>(rows);
  },

  async updateStatus(id: number, status: string): Promise<Order | undefined> {
    await pool.query(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [status, id]
    );
    return this.findById(id);
  },

  async findAll(): Promise<Order[]> {
    const [rows] = await pool.query('SELECT * FROM orders');
    return rows as Order[];
  }
};
export const OrderItemModel = {
  async create(item: Omit<OrderItem, 'id' | 'created_at'>): Promise<OrderItem | undefined> {
    const { order_id, product_id, quantity, price } = item;
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO order_items (order_id, product_id, quantity, price)
       VALUES (?, ?, ?, ?)`,
      [order_id, product_id, quantity, price]
    );
    const [newRows] = await pool.query('SELECT * FROM order_items WHERE id = ?', [result.insertId]);
    return getFirstRow<OrderItem>(newRows);
  },

  async findByOrderId(order_id: number): Promise<OrderItem[]> {
    const [rows] = await pool.query(
      `SELECT oi.*, p.name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [order_id]
    );
    return rows as OrderItem[];
  }
};
export const PaymentModel = {
  async create(payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>): Promise<Payment | undefined> {
    const { order_id, amount, payment_method, status, midtrans_token, midtrans_redirect_url } = payment;
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO payments (order_id, amount, payment_method, status, midtrans_token, midtrans_redirect_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [order_id, amount, payment_method, status, midtrans_token, midtrans_redirect_url]
    );
    return this.findByOrderId(order_id);
  },

  async findByOrderId(order_id: number): Promise<Payment | undefined> {
    const [rows] = await pool.query('SELECT * FROM payments WHERE order_id = ?', [order_id]);
    return getFirstRow<Payment>(rows);
  },

  async updateStatus(id: number, status: string, paid_at?: Date): Promise<Payment | undefined> {
    await pool.query(
      `UPDATE payments SET status = ?, paid_at = ? WHERE id = ?`,
      [status, paid_at, id]
    );
    const [updatedRows] = await pool.query('SELECT * FROM payments WHERE id = ?', [id]);
    return getFirstRow<Payment>(updatedRows);
  }
};