import pool from './config';
import { Order, OrderItem, Payment, User, Product } from '@/types/database';

// User Model
export const UserModel = {
  async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const { name, email, phone, university, address } = user;
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, university, address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, email, phone, university, address]
    );
    return result.rows[0];
  },

  async findById(id: number) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findByEmail(email: string) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }
};

// Product Model
export const ProductModel = {
  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const { name, description, price, stock, image_url, category } = product;
    const result = await pool.query(
      `INSERT INTO products (name, description, price, stock, image_url, category)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description, price, stock, image_url, category]
    );
    return result.rows[0];
  },

  async findById(id: number) {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query('SELECT * FROM products');
    return result.rows;
  }
};

// Order Model
export const OrderModel = {
  async create(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
    const { user_id, total_amount, status, shipping_address, shipping_method } = order;
    const result = await pool.query(
      `INSERT INTO orders (user_id, total_amount, status, shipping_address, shipping_method)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, total_amount, status, shipping_address, shipping_method]
    );
    return result.rows[0];
  },

  async findById(id: number) {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    return result.rows[0];
  },

  async updateStatus(id: number, status: string) {
    const result = await pool.query(
      `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  }
};

// OrderItem Model
export const OrderItemModel = {
  async create(item: Omit<OrderItem, 'id' | 'created_at'>) {
    const { order_id, product_id, quantity, price } = item;
    const result = await pool.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [order_id, product_id, quantity, price]
    );
    return result.rows[0];
  },

  async findByOrderId(order_id: number) {
    const result = await pool.query(
      `SELECT oi.*, p.name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [order_id]
    );
    return result.rows;
  }
};

// Payment Model
export const PaymentModel = {
  async create(payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) {
    const { order_id, amount, payment_method, status, midtrans_token, midtrans_redirect_url } = payment;
    const result = await pool.query(
      `INSERT INTO payments (order_id, amount, payment_method, status, midtrans_token, midtrans_redirect_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [order_id, amount, payment_method, status, midtrans_token, midtrans_redirect_url]
    );
    return result.rows[0];
  },

  async findByOrderId(order_id: number) {
    const result = await pool.query('SELECT * FROM payments WHERE order_id = $1', [order_id]);
    return result.rows[0];
  },

  async updateStatus(id: number, status: string, paid_at?: Date) {
    const result = await pool.query(
      `UPDATE payments 
       SET status = $1, paid_at = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, paid_at, id]
    );
    return result.rows[0];
  }
}; 