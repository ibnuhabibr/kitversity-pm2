import { NextResponse } from 'next/server';
import { ProductModel } from '@/lib/db/models';

// GET all products
export async function GET() {
  try {
    const products = await ProductModel.findAll();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Gagal mengambil data produk' }, { status: 500 });
  }
}

// POST a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Di sini bisa ditambahkan validasi dengan Zod jika diperlukan
    const newProduct = await ProductModel.create(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Gagal membuat produk baru' }, { status: 500 });
  }
}