// Lokasi: app/cara-pesan/page.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ShoppingCart, User, CreditCard, QrCode, MessageCircle, Truck, CheckCircle } from 'lucide-react';

// Definisikan langkah-langkah dalam sebuah array untuk kemudahan
const orderSteps = [
  {
    icon: Search,
    title: "1. Cari & Pilih Produk",
    description: "Jelajahi katalog kami atau gunakan fitur pencarian untuk menemukan kebutuhan kuliahmu. Klik produk untuk melihat detailnya."
  },
  {
    icon: ShoppingCart,
    title: "2. Tambah ke Keranjang",
    description: "Pilih varian (jika ada) dan jumlah, lalu klik tombol 'Masukkan ke Keranjang' atau 'Beli Langsung' untuk checkout."
  },
  {
    icon: User,
    title: "3. Isi Data Diri",
    description: "Lengkapi nama, email, dan nomor WhatsApp aktif Anda di halaman checkout. Pastikan semua data sudah benar."
  },
  {
    icon: CreditCard,
    title: "4. Pilih Metode Pembayaran",
    description: "Pilih metode pembayaran yang paling nyaman, baik melalui Transfer Bank (BCA/Mandiri) maupun QRIS (Semua E-Wallet)."
  },
  {
    icon: QrCode,
    title: "5. Lakukan Pembayaran",
    description: "Selesaikan pembayaran sesuai instruksi. Transfer sesuai nominal yang tertera atau scan kode QRIS yang muncul."
  },
  {
    icon: MessageCircle,
    title: "6. Konfirmasi via WhatsApp",
    description: "Setelah membayar, klik tombol 'Konfirmasi & Kirim Bukti' untuk mengirim bukti transfer ke Admin kami via WhatsApp."
  },
  {
    icon: Truck,
    title: "7. Pesanan Diproses & Dikirim",
    description: "Tim kami akan memverifikasi pembayaran dan segera memproses pesanan Anda. Kami akan kirim secepatnya!"
  },
  {
    icon: CheckCircle,
    title: "8. Pesanan Diterima",
    description: "Paket akan tiba di tujuan Anda. Selamat menikmati produk berkualitas dari Kitversity!"
  }
];

export default function HowToOrderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        
        {/* Header Halaman */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Alur Pemesanan & Pembayaran
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Panduan lengkap langkah demi langkah untuk berbelanja di Kitversity. Mudah, cepat, dan aman!
          </p>
        </div>

        {/* Konten Utama */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Langkah-langkah Berbelanja</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Garis vertikal sebagai timeline */}
              <div className="absolute left-6 h-full border-l-2 border-dashed border-gray-200" />
              
              <ol className="space-y-10">
                {orderSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <li key={index} className="flex items-start space-x-6">
                      <div className="flex-shrink-0 relative z-10">
                        <div className="bg-blue-600 text-white rounded-full h-12 w-12 flex items-center justify-center ring-4 ring-white">
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="pt-1.5">
                        <h3 className="font-bold text-lg text-gray-900">{step.title}</h3>
                        <p className="mt-1 text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Tombol Call-to-Action */}
        <div className="text-center mt-12">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Sudah Paham? Yuk, Mulai Belanja!</h3>
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
              <Link href="/produk">Jelajahi Semua Produk</Link>
            </Button>
        </div>
      </div>
    </div>
  );
}