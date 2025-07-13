import { NextResponse } from 'next/server';
import { ProductModel } from '@/lib/db/models';

// GET: Mengambil satu produk berdasarkan ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await ProductModel.findById(Number(params.id));
    if (!product) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error(`Gagal mengambil produk ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Gagal mengambil data produk' }, { status: 500 });
  }
}

// PUT: Mengupdate produk berdasarkan ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedProduct = await ProductModel.update(Number(params.id), body);
     if (!updatedProduct) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(`Gagal mengupdate produk ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Gagal mengupdate produk' }, { status: 500 });
  }
}

// DELETE: Menghapus produk berdasarkan ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = await ProductModel.deleteById(Number(params.id));
    if (!success) {
       return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error(`Gagal menghapus produk ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Gagal menghapus produk' }, { status: 500 });
  }
}