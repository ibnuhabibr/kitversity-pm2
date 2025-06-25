import mysql from 'mysql2/promise';

let pool;

// Logika ini akan membaca DATABASE_URL jika dideploy ke Vercel nanti
// Tapi saat di lokal, dia akan membaca variabel DB_* dari .env.local
if (process.env.DATABASE_URL) {
  // Konfigurasi untuk production (VPS/Hosting)
  pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    ssl: {
        // Jangan tolak koneksi yang tidak terverifikasi (jika pakai self-signed certificate)
        // Di production asli, sebaiknya gunakan sertifikat SSL yang valid
        rejectUnauthorized: false 
    }
  });
} else {
  // Konfigurasi untuk development lokal (XAMPP)
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kitversity',
    port: parseInt(process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

export default pool;