'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart, Plus, Minus, ChevronRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { products } from '@/data/products';
import { useWishlist } from '@/contexts/WishlistContext';
import Link from 'next/link';


export default function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const { toast } = useToast();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Produk Tidak Ditemukan
          </h1>
        </div>
      </div>
    );
  }

  const productIsWishlisted = isWishlisted(product.id);

  const handleToggleWishlist = () => {
    if (productIsWishlisted) {
      removeFromWishlist(product.id);
      toast({
        title: 'Dihapus dari Wishlist',
        description: `${product.name} telah dihapus dari wishlist Anda.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: 'Ditambahkan ke Wishlist!',
        description: `${product.name} telah ditambahkan ke wishlist Anda.`,
        variant: 'default'
      });
    }
  };

  const validateVariants = () => {
    if (product.variants && product.variants.length > 0) {
      if (Object.keys(selectedVariants).length !== product.variants.length) {
        toast({
          title: "Peringatan",
          description: "Harap pilih semua varian produk terlebih dahulu (misal: Ukuran).",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!validateVariants()) return;

    addItem(product, quantity, selectedVariants);
    toast({
      title: 'Berhasil!',
      description: `${quantity}x ${product.name} ditambahkan ke keranjang`,
      variant: 'default'
    });
  };

  // --- INI BAGIAN YANG DIPERBAIKI ---
  const handleBuyNow = () => {
    if (!validateVariants()) return;

    // 1. Tambahkan item ke keranjang utama
    addItem(product, quantity, selectedVariants);
    
    // 2. Langsung arahkan ke halaman checkout
    router.push('/checkout');
  };
  // --- AKHIR BAGIAN YANG DIPERBAIKI ---


  const handleVariantChange = (variantName: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: value
    }));
  };

  const relatedProducts = products
    .filter(p => p.category.some((cat: any) => product.category.includes(cat)) && p.id !== product.id)
    .slice(0, 4);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };
  
  return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/produk" className="hover:text-blue-600">Produk</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
              <div className="space-y-4">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ position: 'absolute', height: '100%', width: '100%', objectFit: 'cover' }}
                  />
                  {product.discount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(product.rating)}
                      <span className="text-sm text-gray-600 ml-2">
                        ({product.rating})
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      Terjual {product.sold}+
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 mb-6">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {product.variants && product.variants.map((variant: any) => (
                  <div key={variant.name} className="mb-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      {variant.name}
                    </label>
                    <Select
                      value={selectedVariants[variant.name] || ''}
                      onValueChange={(value) => handleVariantChange(variant.name, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Pilih ${variant.name}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {variant.options.map((option: any) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Jumlah
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-4 py-2 font-medium">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Masukkan ke Keranjang
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    size="lg"
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                  >
                    Beli Langsung
                  </Button>
                </div>

                 <Button variant="ghost" className="w-full" onClick={handleToggleWishlist}>
                  <Heart
                    className={`h-5 w-5 mr-2 transition-all ${
                      productIsWishlisted ? 'text-red-500 fill-red-500' : ''
                    }`}
                  />
                  {productIsWishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm mb-8">
            <Tabs defaultValue="description" className="p-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description">Deskripsi</TabsTrigger>
                <TabsTrigger value="specifications">Spesifikasi</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="specifications" className="mt-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.specifications}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {relatedProducts.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Kamu Mungkin Juga Suka
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
  );
}