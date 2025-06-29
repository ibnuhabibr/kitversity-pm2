// Lokasi: lib/db/config.ts

import mysql from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';

// Deklarasikan pool di scope global, tapi jangan langsung diisi
let pool: Pool | null = null;

// Buat fungsi untuk mendapatkan koneksi pool (Pola Singleton)
const getPool = () => {
  // Jika pool belum pernah dibuat, maka buat sekarang
  if (!pool) {
    try {
      console.log("Creating new database connection pool...");
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
      console.error("FATAL: Failed to create database connection pool.", error);
      // Hentikan proses jika koneksi database gagal dibuat, karena aplikasi tidak bisa berjalan
      process.exit(1); 
    }
  }
  // Kembalikan pool yang sudah ada atau yang baru dibuat
  return pool;
};

// Ekspor fungsi getPool, bukan variabel pool langsung
export default getPool();