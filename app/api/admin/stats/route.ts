// Lokasi: app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db/config';

export async function GET() {
  try {
    const [ordersResult] = await pool.query(`
      SELECT 
        COUNT(*) as totalOrders,
        SUM(total_amount) as totalRevenue
      FROM orders
    `);

    const [productsResult] = await pool.query(`
        SELECT COUNT(*) as totalProducts FROM products
    `);
    
    // Asumsi tabel users ada
     const [usersResult] = await pool.query(`
        SELECT COUNT(*) as totalUsers FROM users
    `);

    const stats = {
      totalRevenue: (ordersResult as any)[0].totalRevenue || 0,
      totalOrders: (ordersResult as any)[0].totalOrders || 0,
      totalProducts: (productsResult as any)[0].totalProducts || 0,
      totalUsers: (usersResult as any)[0].totalUsers || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Gagal mengambil data statistik' }, { status: 500 });
  }
}