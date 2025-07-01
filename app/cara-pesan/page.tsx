// Lokasi: app/cara-pesan/page.tsx

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, ShoppingCart, User, CreditCard, QrCode, MessageCircle, Truck, CheckCircle, Receipt, Users, Home, LayoutGrid, Bot, HelpCircle, Heart } from 'lucide-react';

// Alur Pemesanan (Tetap sama)
const orderSteps = [
  { icon: Home, title: "1. Kunjungi Website", description: "Kunjungi website kami di WWW.KITVERSITY.COM." },
  { icon: Search, title: "2. Cari & Pilih Produk", description: "Jelajahi katalog atau gunakan fitur pencarian, lalu klik produk untuk melihat detail." },
  { icon: ShoppingCart, title: "3. Tambah Ke Keranjang", description: "Pilih varian dan jumlah, lalu klik tombol 'Masukkan ke Keranjang' atau 'Beli Langsung'." },
  { icon: User, title: "4. Isi Data Diri", description: "Lengkapi Nama, Email, dan Nomor WhatsApp aktif di halaman checkout." },
  { icon: CreditCard, title: "5. Pilih Metode Pembayaran", description: "Pilih metode pembayaran yang paling nyaman, seperti Transfer Bank atau metode lainnya." },
  { icon: QrCode, title: "6. Lakukan Pembayaran", description: "Selesaikan pembayaran sesuai instruksi pada halaman pembayaran." },
  { icon: MessageCircle, title: "7. Konfirmasi Via WhatsApp", description: "Klik tombol 'Konfirmasi & Kirim Bukti' untuk mengirim bukti transfer ke Admin." },
  { icon: Receipt, title: "8. Terima Invoice Pembelian", description: "Anda akan menerima invoice pesanan resmi via WhatsApp dan Email." },
  { icon: Users, title: "9. Gabung Grup WhatsApp", description: "Dapatkan tautan undangan grup WhatsApp untuk komunikasi dan info lebih lanjut." },
  { icon: Truck, title: "10. Pesanan Diproses & Dikirim", description: "Tim kami akan memverifikasi pembayaran dan segera memproses pesanan Anda." }
];

// --- KONTEN BARU UNTUK TUR WEBSITE ---
const tourStops = [
    { 
        icon: Home, 
        title: "Beranda", 
        description: "Temukan promo terbaru, produk paling laris, dan pengumuman penting langsung di halaman utama kami.",
        href: "/"
    },
    { 
        icon: LayoutGrid, 
        title: "Halaman Produk", 
        description: "Jelajahi semua koleksi produk kami. Gunakan filter dan pencarian untuk menemukan barang dengan cepat.",
        href: "/produk"
    },
    { 
        icon: Bot, 
        title: "Chatbot AI 24/7", 
        description: "Punya pertanyaan kapan saja? Asisten AI kami siap menjawab seputar produk dan pemesanan.",
        href: "/chat"
    },
    { 
        icon: HelpCircle, 
        title: "Pusat Bantuan (FAQ)", 
        description: "Temukan jawaban dari pertanyaan yang sering diajukan oleh pelanggan lain di halaman FAQ.",
        href: "/faq"
    },
    { 
        icon: Heart, 
        title: "Wishlist", 
        description: "Simpan produk-produk yang Anda suka dengan menekan tombol hati untuk dilihat atau dibeli nanti.",
        href: "/wishlist"
    }
];

export default function HowToOrderPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto max-w-7xl px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Alur Pemesanan & Tur Website</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">Panduan lengkap berbelanja di Kitversity dan jelajahi semua fitur yang kami sediakan untuk Anda.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Kolom Kiri: Alur Pemesanan */}
                    <div className="lg:col-span-3">
                        <Card className="shadow-lg h-full">
                            <CardHeader>
                                <CardTitle className="text-2xl text-center">Langkah-langkah Berbelanja</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ol className="space-y-8">
                                    {orderSteps.map((step, index) => {
                                        const Icon = step.icon;
                                        return (
                                            <li key={index} className="flex items-start space-x-4">
                                                <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full h-10 w-10 flex items-center justify-center ring-4 ring-white">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-md text-gray-900">{step.title}</h3>
                                                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">{step.description}</p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ol>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom Kanan: Tur Website */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="shadow-lg sticky top-24">
                            <CardHeader>
                                <CardTitle>Tur Singkat Website</CardTitle>
                                <CardDescription>Jelajahi fitur-fitur utama yang kami sediakan untuk Anda.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {tourStops.map((stop, index) => {
                                    const Icon = stop.icon;
                                    return (
                                        <div key={index} className="flex flex-col items-start p-4 rounded-lg bg-gray-50 border hover:border-gray-300 transition-colors">
                                            <div className="flex items-center gap-3 w-full">
                                                <div className="flex-shrink-0 bg-purple-100 text-purple-600 rounded-lg h-10 w-10 flex items-center justify-center">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-800">{stop.title}</h4>
                                                    <p className="text-xs text-gray-500">{stop.description}</p>
                                                </div>
                                            </div>
                                            <div className="w-full mt-3">
                                                 <Button asChild variant="outline" size="sm" className="w-full">
                                                    <Link href={stop.href}>
                                                        Kunjungi Halaman
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}