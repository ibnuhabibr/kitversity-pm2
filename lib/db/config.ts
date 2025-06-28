// Lokasi: lib/db/config.ts

import mysql from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';

let pool: Pool;

// Logika ini akan membaca DATABASE_URL jika dideploy ke Vercel nanti
// Tapi saat di lokal, dia akan membaca variabel DB_* dari .env.local
if (process.env.DATABASE_URL) {
  // BAGIAN INI UNTUK VPS (PRODUCTION)
  pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    // ...
  });
} else {
  // BAGIAN INI UNTUK LOKAL (XAMPP)
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    // ...
  });
}

export default pool;