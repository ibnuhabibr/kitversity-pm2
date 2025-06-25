import pool from './config';

// Fungsi untuk membuat tabel-tabel yang diperlukan
export async function createTables() {
  try {
    // Tabel Orders (SUDAH DIMODIFIKASI)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending-payment', -- Status baru
        shipping_address TEXT, -- Tidak wajib
        shipping_method VARCHAR(100),
        payment_method VARCHAR(50), -- Kolom baru
        customer_info JSON, -- Kolom baru untuk menyimpan info customer
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    // Tabel lain tetap sama...
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        university VARCHAR(255),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);
    // ... (sisa tabel lainnya)

    console.log('Database tables created/updated successfully for MySQL');
  } catch (error) {
    console.error('Error creating database tables:', error);
    throw error;
  }
}
// ... sisa file