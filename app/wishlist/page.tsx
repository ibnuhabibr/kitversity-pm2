// Lokasi: app/wishlist/page.tsx

'use client';

import Link from 'next/link';
import { Heart, X } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { type Product } from '@/contexts/CartContext';

export default function WishlistPage() {
  const { state, removeFromWishlist } = useWishlist();
  const { toast } = useToast();

  const handleRemove = (product: Product) => {
    removeFromWishlist(product.id);
    toast({
      title: 'Dihapus dari Wishlist',
      description: `${product.name} telah dihapus.`,
    });
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Wishlist Anda Kosong
          </h1>
          <p className="text-gray-600 mb-8">
            Simpan produk impian Anda di sini dengan menekan tombol hati pada halaman produk.
          </p>
          <Button asChild size="lg">
            <Link href="/produk">Mulai Cari Produk</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Wishlist Saya
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {state.items.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(product)}
                title="Hapus dari Wishlist"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}