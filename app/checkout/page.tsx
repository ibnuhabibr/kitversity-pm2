// Lokasi: app/checkout/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, type CartItem } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, QrCode, User, Mail, Phone, CheckCircle, Package, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type NewPaymentMethod = 'bank_transfer' | 'qris';
type ShippingMethod = 'cod' | 'delivery';

const OptionCard = ({ isSelected, onSelect, title, description, icon }: {
    isSelected: boolean;
    onSelect: () => void;
    title: string;
    description: string;
    icon: React.ReactNode;
}) => (
    <div
        onClick={onSelect}
        className={cn(
            "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all duration-200",
            isSelected ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500" : "border-gray-200 hover:border-gray-400"
        )}
    >
        <div className="flex-shrink-0 text-blue-600">{icon}</div>
        <div className="flex-1">
            <p className="font-semibold text-gray-800">{title}</p>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        {isSelected && <CheckCircle className="w-5 h-5 text-blue-500" />}
    </div>
);

export default function CheckoutPage() {
  const router = useRouter();
  const { state: cartState, clearCart } = useCart();
  
  // State untuk menampung item yang akan di-checkout
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  // State untuk menandai apakah ini sesi "Beli Langsung"
  const [isBuyNow, setIsBuyNow] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState<NewPaymentMethod>('bank_transfer');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('cod');

  // --- LOGIKA UTAMA DI SINI ---
  useEffect(() => {
    const buyNowItemString = sessionStorage.getItem('buyNowItem');
    if (buyNowItemString) {
      try {
        const buyNowItems = JSON.parse(buyNowItemString);
        setCheckoutItems(buyNowItems);
        setIsBuyNow(true);
      } catch (e) {
        // Jika gagal parsing, gunakan keranjang utama
        setCheckoutItems(cartState.items);
        setIsBuyNow(false);
      }
    } else {
      // Jika tidak ada item Beli Langsung, gunakan keranjang utama
      setCheckoutItems(cartState.items);
      setIsBuyNow(false);
    }
  }, [cartState.items]);

  const getTotalPrice = () => {
    return checkoutItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const totalPrice = getTotalPrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        setError("Harap isi Nama, Email, dan Nomor WhatsApp.");
        setIsLoading(false);
        return;
    }
    if (shippingMethod === 'delivery' && !customerInfo.address) {
        setError("Harap isi alamat lengkap untuk pengiriman.");
        setIsLoading(false);
        return;
    }
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: checkoutItems, // Kirim item yang sudah difilter
          customerInfo: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
            address: shippingMethod === 'delivery' ? customerInfo.address : 'COD Kampus UNAIR',
          }, 
          paymentMethod 
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal membuat pesanan');
      
      // --- PERUBAHAN LOGIKA PEMBERSIHAN ---
      if (isBuyNow) {
        // Jika Beli Langsung, hanya hapus item sementara
        sessionStorage.removeItem('buyNowItem');
      } else {
        // Jika dari keranjang, baru kosongkan keranjang utama
        clearCart();
      }
      // --- AKHIR PERUBAHAN ---

      router.push(`/pembayaran/${data.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan, silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // ... (sisa kode komponen tetap sama)
  return (
    <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Selesaikan Pesanan Anda</h1>
                <p className="text-center text-gray-500 mb-8">Hanya beberapa langkah lagi untuk mendapatkan produk impianmu.</p>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="text-xl">1. Data Diri</CardTitle>
                                <CardDescription>Pastikan data diisi dengan benar.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input placeholder="Nama Lengkap" value={customerInfo.name} onChange={(e) => setCustomerInfo(p => ({ ...p, name: e.target.value }))} required className="pl-10"/>
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input type="email" placeholder="Alamat Email" value={customerInfo.email} onChange={(e) => setCustomerInfo(p => ({ ...p, email: e.target.value }))} required className="pl-10"/>
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input type="tel" placeholder="Nomor WhatsApp (e.g. 0812...)" value={customerInfo.phone} onChange={(e) => setCustomerInfo(p => ({ ...p, phone: e.target.value }))} required className="pl-10"/>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="text-xl">2. Metode Pengiriman</CardTitle>
                                <CardDescription>Pilih metode pengambilan atau pengiriman pesananmu.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <OptionCard
                                    isSelected={shippingMethod === 'cod'}
                                    onSelect={() => setShippingMethod('cod')}
                                    title="Ambil di Kampus UNAIR"
                                    description="Gratis. Detail lokasi & waktu akan diinfokan di grup."
                                    icon={<Package className="w-6 h-6" />}
                                />
                                <OptionCard
                                    isSelected={shippingMethod === 'delivery'}
                                    onSelect={() => setShippingMethod('delivery')}
                                    title="Gratis Kirim ke Rumah"
                                    description="Khusus untuk area kota Surabaya."
                                    icon={<Home className="w-6 h-6" />}
                                />
                                {shippingMethod === 'delivery' && (
                                    <div className="pt-2 animate-in fade-in-50">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap Pengiriman</label>
                                        <Textarea id="address" placeholder="Contoh: Jl. Pahlawan No. 123, Kel. Bubutan, Kec. Bubutan, Surabaya, 60174" value={customerInfo.address} onChange={(e) => setCustomerInfo(p => ({...p, address: e.target.value}))} required/>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="text-xl">3. Metode Pembayaran</CardTitle>
                                <CardDescription>Pilih metode pembayaran yang paling nyaman.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <OptionCard
                                    isSelected={paymentMethod === 'bank_transfer'}
                                    onSelect={() => setPaymentMethod('bank_transfer')}
                                    title="Transfer Bank"
                                    description="BCA, Mandiri & Bank lainnya"
                                    icon={<CreditCard className="w-6 h-6" />}
                                />
                                <OptionCard
                                    isSelected={paymentMethod === 'qris'}
                                    onSelect={() => setPaymentMethod('qris')}
                                    title="QRIS"
                                    description="GoPay, OVO, Dana, ShopeePay, M-Banking"
                                    icon={<QrCode className="w-6 h-6" />}
                                />
                            </CardContent>
                        </Card>

                        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

                        <Button type="submit" size="lg" className="w-full text-base font-bold" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Lanjut ke Pembayaran'}
                        </Button>
                    </form>

                    <div className="lg:col-span-2">
                        <Card className="sticky top-24 shadow-md">
                            <CardHeader>
                                <CardTitle>Ringkasan Belanja</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                    {checkoutItems.map((item) => (
                                        <div key={item.cartItemId || item.id} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden relative">
                                                    <Image src={item.image || ''} alt={item.name} layout="fill" className="object-cover"/>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{item.name}</p>
                                                    <p className="text-gray-500">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                                                </div>
                                            </div>
                                            <p className="font-semibold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t my-4" />
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <p>Subtotal</p>
                                        <p>Rp {totalPrice.toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p>Ongkos Kirim</p>
                                        <p className="text-green-600 font-medium">Gratis</p>
                                    </div>
                                    <div className="border-t my-2" />
                                    <div className="flex justify-between font-bold text-lg">
                                        <p>Total</p>
                                        <p>Rp {totalPrice.toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}