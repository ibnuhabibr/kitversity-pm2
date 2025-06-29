import { products } from '@/data/products';
import ProductDetailClient from '@/components/ProductDetailClient';

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find(p => p.id === params.id);

  // Perhatikan: Semua logika dipindahkan ke ProductDetailClient
  // untuk memungkinkan penggunaan hooks ('use client').
  // Di sini kita hanya mengambil data dan meneruskannya.
  return <ProductDetailClient product={product} />;
}