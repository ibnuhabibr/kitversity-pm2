// Lokasi: app/api/orders/[orderId]/route.ts

import { NextResponse } from 'next/server';
import { OrderModel } from '@/lib/db/models';

// DELETE: Menghapus pesanan berdasarkan ID
export async function DELETE(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const success = await OrderModel.deleteById(Number(params.orderId));
    if (!success) {
       return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }
    // Karena item pesanan menggunakan ON DELETE CASCADE, mereka akan terhapus otomatis.
    return NextResponse.json({ message: 'Pesanan berhasil dihapus' });
  } catch (error) {
    console.error(`Gagal menghapus pesanan ID ${params.orderId}:`, error);
    return NextResponse.json({ error: 'Gagal menghapus pesanan' }, { status: 500 });
  }
}