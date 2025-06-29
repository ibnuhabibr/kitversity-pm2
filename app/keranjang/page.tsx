'use client';

import React from 'react';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../hooks/use-toast';

export default function CartPage() {
  const router = {
    push: (path) => {
      window.location.href = path;
    },
  };
  // Memperbaiki pemanggilan hook dengan menambahkan getTotalItems
  const { state, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCart();
  const { toast } = useToast();

  const handleCheckout = () => {
    sessionStorage.removeItem('buyNowItem');
    router.push('/checkout');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Use cartItemId to handle quantity changes
  const handleQuantityChange = (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(cartItemId);
      return;
    }
    updateQuantity(cartItemId, newQuantity);
  };

  // Use cartItemId to remove items
  const handleRemoveItem = (cartItemId) => {
    removeItem(cartItemId);
    toast({
      title: 'Produk Dihapus',
      description: 'Produk berhasil dihapus dari keranjang',
      variant: 'default'
    });
  };

  const totalPrice = getTotalPrice();
  const shippingCost = 0; // Will be calculated later
  const finalTotal = totalPrice + shippingCost;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Keranjang Belanja Kosong
          </h1>
          <p className="text-gray-600 mb-8">
            Belum ada produk yang ditambahkan ke keranjang. Yuk mulai belanja!
          </p>
          <a href="/produk">
            <Button size="lg">Mulai Belanja</Button>
          </a>
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
              // Use cartItemId as the unique key for mapping
              <div key={item.cartItemId} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="relative w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                        <a href={`/produk/${item.id}`} className="hover:text-blue-600">
                          {item.name}
                        </a>
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        // Pass cartItemId to the remove handler
                        onClick={() => handleRemoveItem(item.cartItemId)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-4"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Variants */}
                    {item.selectedVariants && Object.entries(item.selectedVariants).length > 0 && (
                      <div className="mb-2">
                        {Object.entries(item.selectedVariants).map(([key, value]) => (
                          <span key={key} className="text-sm text-gray-600 mr-4">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Price and Quantity */}
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

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            // Pass cartItemId to the quantity change handler
                            onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            // Pass cartItemId to the quantity change handler
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
                  {/* Memanggil getTotalItems() yang sudah di-destructure */}
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

              <a href="/produk">
                <Button variant="outline" className="w-full">Lanjut Belanja</Button>
              </a>

              {/* Promo Info */}
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
