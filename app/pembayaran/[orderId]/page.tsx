// Lokasi: app/pembayaran/[orderId]/page.tsx

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

// --- DETAIL BANK SUDAH SESUAI PERMINTAAN ---
const bankDetails = [
    { name: 'Bank BCA', noRek: '7355011704', atasNama: 'Ibnu Habib Ridwansyah', logo: '/logo-bca.png' },
];

// Komponen untuk menampilkan detail pembayaran
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

  const handlePaymentConfirmation = () => {
      router.push(`/terimakasih/${orderId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="ml-4 text-lg">Memuat detail pesanan...</p>
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
          <CardHeader className="text-center bg-gray-50 rounded-t-lg p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-800">Instruksi Pembayaran</h1>
            <CardDescription className="mt-1">
                Selesaikan dalam <strong>1x24 jam</strong> untuk pesanan ID: <span className="font-semibold text-primary">{order.id}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Alert className="mb-6 text-center bg-blue-50 border-blue-200">
              <AlertDescription>
                <div className="text-sm text-gray-600">Total Pembayaran</div>
                <div 
                    className="text-3xl font-bold text-gray-800 my-1 tracking-tight cursor-pointer hover:bg-blue-100 rounded-md py-1" 
                    onClick={() => handleCopy(order.totalAmount.toString(), 'Total Pembayaran')}
                >
                    Rp {order.totalAmount.toLocaleString('id-ID')} <Copy className="inline h-4 w-4 text-gray-400" />
                </div>
                <div className="text-xs text-red-600 font-medium">PENTING: Mohon transfer sesuai nominal di atas.</div>
              </AlertDescription>
            </Alert>
  
            {/* Tampilan untuk Transfer Bank */}
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
                 <div className="text-xs text-gray-500 pt-2 bg-gray-50 p-3 rounded-md">
                    <p className="font-bold mb-2">Tata Cara Pembayaran:</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Buka aplikasi M-Banking/Internet Banking atau pergi ke ATM BCA.</li>
                        <li>Pilih menu **Transfer** dan masukkan nomor rekening tujuan di atas.</li>
                        <li>Masukkan jumlah transfer **sesuai nominal total pembayaran**.</li>
                        <li>Simpan bukti transfer (screenshot/foto struk).</li>
                        <li>Klik tombol **"Konfirmasi & Lanjut"** di bawah jika sudah membayar.</li>
                    </ol>
                </div>
              </div>
            )}
    
            {/* Tampilan untuk QRIS */}
            {order.paymentMethod === 'qris' && (
              <div className="space-y-4">
                 <div className="flex items-center gap-3 mb-3">
                    <QrCode className="w-6 h-6 text-primary" />
                    <h3 className="font-semibold text-lg text-gray-800">Scan QRIS Berikut</h3>
                </div>
                <div className="flex justify-center p-4 bg-white rounded-lg border">
                  {/* Pastikan gambar qris.png ada di folder /public */}
                  <Image src="/qris.png" alt="QRIS Code Kitversity" width={280} height={280} priority />
                </div>
                 <div className="text-xs text-gray-500 pt-2 bg-gray-50 p-3 rounded-md">
                    <p className="font-bold mb-2">Tata Cara Pembayaran:</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Buka aplikasi E-Wallet (GoPay, OVO, Dana, ShopeePay) atau Mobile Banking.</li>
                        <li>Pilih menu **Bayar** atau **Scan QRIS**.</li>
                        <li>Scan kode QR di atas.</li>
                        <li>Pastikan nama merchant adalah **"Kitversity"** dan jumlahnya sesuai.</li>
                        <li>Simpan bukti pembayaran (screenshot).</li>
                        <li>Klik tombol **"Konfirmasi & Lanjut"** di bawah jika sudah membayar.</li>
                    </ol>
                </div>
              </div>
            )}
  
            <div className="mt-8">
              <Button onClick={handlePaymentConfirmation} size="lg" className="w-full font-bold text-base">
                Konfirmasi & Lanjut <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Komponen utama halaman yang menggunakan Suspense untuk loading
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