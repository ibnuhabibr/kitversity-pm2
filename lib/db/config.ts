// Lokasi: lib/db/config.ts

import mysql from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';

let pool: Pool;

// Inisialisasi koneksi pool hanya sekali
if (!pool) {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    console.log("Database connection pool created successfully.");
  } catch (error) {
    console.error("Failed to create database connection pool:", error);
  }
}

export default pool;