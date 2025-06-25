'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { OrderItem } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, QrCode, User, Mail, Phone, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type NewPaymentMethod = 'bank_transfer' | 'qris';

// Komponen Pembantu untuk Opsi Pembayaran
const PaymentOption = ({ method, title, description, icon, selectedMethod, onSelect }: {
    method: NewPaymentMethod;
    title: string;
    description: string;
    icon: React.ReactNode;
    selectedMethod: NewPaymentMethod;
    onSelect: (method: NewPaymentMethod) => void;
}) => {
    const isSelected = selectedMethod === method;
    return (
        <div
            onClick={() => onSelect(method)}
            className={cn(
                "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all duration-200",
                isSelected ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500" : "border-gray-200 hover:border-gray-400"
            )}
        >
            <div className="flex-shrink-0">{icon}</div>
            <div className="flex-1">
                <p className="font-semibold text-gray-800">{title}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            {isSelected && <CheckCircle className="w-6 h-6 text-blue-500" />}
        </div>
    );
};


// Komponen Utama Halaman Checkout
export default function CheckoutPage() {
  const router = useRouter();
  const { state: cartState, clearCart } = useCart();
  const [checkoutItems, setCheckoutItems] = useState<OrderItem[]>([]);
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<NewPaymentMethod>('bank_transfer');

  useEffect(() => {
    const buyNowItemString = sessionStorage.getItem('buyNowItem');
    if (buyNowItemString) {
      try {
        const buyNowItems = JSON.parse(buyNowItemString);
        if (Array.isArray(buyNowItems) && buyNowItems.length > 0) {
          setCheckoutItems(buyNowItems);
          setIsBuyNow(true);
          return;
        }
      } catch (error) {
        console.error("Gagal memproses buyNowItem dari sessionStorage", error);
      }
    }
    setCheckoutItems(cartState.items);
    setIsBuyNow(false);
  }, [cartState.items]);

  const getTotalPrice = () => {
    return checkoutItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validasi form sederhana
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        setError("Harap isi semua data diri.");
        setIsLoading(false);
        return;
    }
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: checkoutItems, customerInfo, paymentMethod })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal membuat pesanan');

      if (isBuyNow) {
        sessionStorage.removeItem('buyNowItem');
      } else {
        clearCart();
      }

      router.push(`/pembayaran/${data.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan, silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!cartState.items.length && !isBuyNow) {
    return (
        <div className="container max-w-lg mx-auto py-12 text-center">
            <Alert>
                <AlertDescription>
                    Keranjang belanja Anda kosong. Silakan tambahkan produk untuk melanjutkan.
                </AlertDescription>
            </Alert>
            <Button className="mt-4" onClick={() => router.push('/produk')}>
                Kembali Belanja
            </Button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Selesaikan Pesanan Anda</h1>
                <p className="text-center text-gray-500 mb-8">Hanya beberapa langkah lagi untuk mendapatkan produk impianmu.</p>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    <div className="lg:col-span-3 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Card className="shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-xl">1. Data Diri</CardTitle>
                                    <CardDescription>Pastikan data diisi dengan benar untuk pengiriman.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input id="name" placeholder="Nama Lengkap" value={customerInfo.name} onChange={(e) => setCustomerInfo(p => ({ ...p, name: e.target.value }))} required className="pl-10"/>
                                    </div>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input id="email" type="email" placeholder="Alamat Email" value={customerInfo.email} onChange={(e) => setCustomerInfo(p => ({ ...p, email: e.target.value }))} required className="pl-10"/>
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input id="phone" type="tel" placeholder="Nomor WhatsApp (e.g. 0812...)" value={customerInfo.phone} onChange={(e) => setCustomerInfo(p => ({ ...p, phone: e.target.value }))} required className="pl-10"/>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-xl">2. Metode Pembayaran</CardTitle>
                                    <CardDescription>Pilih metode pembayaran yang paling nyaman untuk Anda.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <PaymentOption
                                        method="bank_transfer"
                                        title="Transfer Bank"
                                        description="BCA, Mandiri, BRI, & lainnya"
                                        icon={<CreditCard className="w-6 h-6 text-blue-600" />}
                                        selectedMethod={paymentMethod}
                                        onSelect={setPaymentMethod}
                                    />
                                    <PaymentOption
                                        method="qris"
                                        title="QRIS"
                                        description="Semua E-Wallet & Mobile Banking"
                                        icon={<QrCode className="w-6 h-6 text-purple-600" />}
                                        selectedMethod={paymentMethod}
                                        onSelect={setPaymentMethod}
                                    />
                                </CardContent>
                            </Card>

                            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

                            <Button type="submit" size="lg" className="w-full text-base font-bold" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Lanjut ke Pembayaran'}
                            </Button>
                        </form>
                    </div>

                    <div className="lg:col-span-2">
                        <Card className="sticky top-24 shadow-md">
                            <CardHeader>
                                <CardTitle>Ringkasan Belanja</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {checkoutItems.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden relative">
                                                    <Image src={item.image || ''} alt={item.name} fill className="object-cover"/>
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
                                        <p>Rp {getTotalPrice().toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p>Ongkos Kirim</p>
                                        <p className="text-green-600 font-medium">Gratis</p>
                                    </div>
                                    <div className="border-t my-2" />
                                    <div className="flex justify-between font-bold text-lg">
                                        <p>Total</p>
                                        <p>Rp {getTotalPrice().toLocaleString('id-ID')}</p>
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
