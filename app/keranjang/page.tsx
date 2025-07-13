'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const router = useRouter();
  const { state, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCart();
  const { toast } = useToast();

  const handleCheckout = () => {
    sessionStorage.removeItem('buyNowItem');
    router.push('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(cartItemId);
      return;
    }
    updateQuantity(cartItemId, newQuantity);
  };

  const handleRemoveItem = (cartItemId: string) => {
    const itemToRemove = state.items.find(item => item.cartItemId === cartItemId);
    if (itemToRemove) {
        removeItem(cartItemId);
        toast({
            title: 'Produk Dihapus',
            description: `${itemToRemove.name} berhasil dihapus dari keranjang.`,
            variant: 'default'
        });
    }
  };

  const totalPrice = getTotalPrice();
  const shippingCost = 0; // Akan dihitung nanti
  const finalTotal = totalPrice + shippingCost;

  if (state.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Keranjang Belanja Kosong
          </h1>
          <p className="text-gray-600 mb-8">
            Belum ada produk yang ditambahkan ke keranjang. Yuk mulai belanja!
          </p>
          <Button asChild size="lg">
            <Link href="/produk">Mulai Belanja</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Keranjang Belanja
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <div key={item.cartItemId} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                        <Link href={`/produk/${item.id}`} className="hover:text-blue-600">
                          {item.name}
                        </Link>
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.cartItemId)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                        title="Hapus item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {item.selectedVariants && Object.entries(item.selectedVariants).length > 0 && (
                      <div className="mb-2">
                        {Object.entries(item.selectedVariants).map(([key, value]) => (
                          <span key={key} className="text-sm text-gray-600 mr-4">
                            {key}: <strong>{value}</strong>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-4 py-1.5 font-medium min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <span className="font-semibold text-gray-900 min-w-[6rem] text-right">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Ringkasan Pesanan
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({getTotalItems()} item)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ongkos Kirim</span>
                  <span className="font-medium text-green-600">Gratis</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <Button onClick={handleCheckout} className="w-full mb-4 bg-orange-500 hover:bg-orange-600" size="lg">
                Lanjut ke Pembayaran
              </Button>

              <Button asChild variant="outline" className="w-full">
                 <Link href="/produk">Lanjut Belanja</Link>
              </Button>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-1">
                  💡 Tips Hemat
                </p>
                <p className="text-sm text-blue-700">
                  Gratis ongkir untuk area Surabaya dan Kampus UNAIR tanpa minimal pembelian!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}