'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Copy, ArrowRight, Banknote, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/types/order';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const bankDetails = [
    { name: 'Bank BCA', noRek: '1234567890', atasNama: 'Kitversity Indonesia', logo: '/logo-bca.svg' },
    { name: 'Bank Mandiri', noRek: '0987654321', atasNama: 'Kitversity Indonesia', logo: '/logo-mandiri.svg' },
];

const PaymentContent = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!orderId) return;
    
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/orders?id=${orderId}`);
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Gagal memuat detail pesanan.');
        }
        const data = await response.json();
        setOrder(data.order);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleCopy = (textToCopy: string, label: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast({ title: 'Berhasil disalin!', description: `${label}: ${textToCopy}` });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container max-w-lg mx-auto py-12 px-4 text-center">
        <Alert variant="destructive">
            <AlertDescription>{error || 'Pesanan tidak dapat ditemukan.'}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/')} className="mt-4">
            Kembali ke Beranda
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container max-w-lg mx-auto px-4">
        <Card className="shadow-lg animate-in fade-in-50 duration-500">
          <CardHeader className="text-center bg-gray-50 rounded-t-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800">Instruksi Pembayaran</h1>
            <CardDescription className="mt-1">
                Selesaikan dalam <strong>1x24 jam</strong> untuk pesanan ID: <span className="font-semibold text-primary">{order.id}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Alert className="mb-6 text-center">
              <AlertDescription>
                <div className="text-sm text-gray-600">Total Pembayaran</div>
                <div className="text-3xl font-bold text-gray-800 my-1 tracking-tight" onClick={() => handleCopy(order.totalAmount.toString(), 'Total Pembayaran')}>
                    Rp {order.totalAmount.toLocaleString('id-ID')} <Copy className="inline h-4 w-4 text-gray-400 cursor-pointer" />
                </div>
                <div className="text-xs text-red-600 font-medium">PENTING: Mohon transfer sesuai nominal di atas.</div>
              </AlertDescription>
            </Alert>
  
            {order.paymentMethod === 'bank_transfer' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-3">
                    <Banknote className="w-6 h-6 text-primary" />
                    <h3 className="font-semibold text-lg text-gray-800">Transfer ke Rekening Berikut</h3>
                </div>
                {bankDetails.map(bank => (
                  <div key={bank.name} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Image src={bank.logo} alt={`${bank.name} logo`} width={60} height={20} className="object-contain" />
                      <div>
                        <p className="font-semibold text-gray-700">{bank.noRek}</p>
                        <p className="text-xs text-gray-500">a.n. {bank.atasNama}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(bank.noRek, 'Nomor Rekening')}>
                      <Copy className="h-3 w-3 mr-1.5" /> Salin
                    </Button>
                  </div>
                ))}
                 <div className="text-xs text-gray-500 pt-2">
                    <p><strong>Tata Cara:</strong></p>
                    <ol className="list-decimal list-inside space-y-1 mt-1">
                        <li>Buka aplikasi mobile banking atau pergi ke ATM.</li>
                        <li>Pilih menu transfer dan masukkan nomor rekening tujuan di atas.</li>
                        <li>Masukkan jumlah transfer **sesuai total pembayaran**.</li>
                        <li>Simpan bukti transfer (screenshot/foto struk).</li>
                        <li>Klik tombol "Saya Sudah Bayar" di bawah ini.</li>
                    </ol>
                </div>
              </div>
            )}
    
            {order.paymentMethod === 'qris' && (
              <div className="space-y-4">
                 <div className="flex items-center gap-3 mb-3">
                    <QrCode className="w-6 h-6 text-primary" />
                    <h3 className="font-semibold text-lg text-gray-800">Scan QRIS Berikut</h3>
                </div>
                <div className="flex justify-center p-4 bg-white rounded-lg border">
                  <Image src="/qris.png" alt="QRIS Code" width={280} height={280} priority />
                </div>
                 <div className="text-xs text-gray-500 pt-2">
                    <p><strong>Tata Cara:</strong></p>
                    <ol className="list-decimal list-inside space-y-1 mt-1">
                        <li>Buka aplikasi E-Wallet (GoPay, OVO, Dana, ShopeePay) atau Mobile Banking.</li>
                        <li>Pilih menu Bayar atau Scan QRIS.</li>
                        <li>Scan kode QR di atas.</li>
                        <li>Masukkan PIN Anda dan selesaikan pembayaran.</li>
                        <li>Simpan bukti pembayaran (screenshot).</li>
                        <li>Klik tombol "Saya Sudah Bayar" di bawah ini.</li>
                    </ol>
                </div>
              </div>
            )}
  
            <div className="mt-8">
              <Button onClick={() => router.push(`/terimakasih/${order.id}`)} size="lg" className="w-full font-bold text-base">
                Saya Sudah Bayar <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}

