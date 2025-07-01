// Lokasi: app/cara-pesan/page.tsx

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, ShoppingCart, User, CreditCard, QrCode, MessageCircle, Truck, CheckCircle, Receipt, Users, Star, Heart, Bot, FileText } from 'lucide-react';

// --- Alur Pemesanan Baru ---
const orderSteps = [
  { icon: FileText, title: "1. Kunjungi Website", description: "Kunjungi website kami di WWW.KITVERSITY.COM." },
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

const features = [
  { icon: Star, title: "Produk Terkurasi", description: "Kami hanya memilih produk berkualitas tinggi yang relevan untuk kebutuhan mahasiswa." },
  { icon: Heart, title: "Fitur Wishlist", description: "Simpan produk impianmu untuk dibeli nanti dengan menekan tombol hati." },
  { icon: Bot, title: "Chatbot AI 24/7", description: "Punya pertanyaan di luar jam kerja? Tanya langsung ke Chatbot AI kami yang cerdas." },
];

export default function HowToOrderPage() {

    const handleWhatsAppClick = () => {
        const message = 'Halo! Saya butuh bantuan terkait pemesanan di Kitversity.';
        const whatsappUrl = `https://wa.me/6285135706028?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto max-w-7xl px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Alur Pemesanan & Informasi</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">Panduan lengkap berbelanja di Kitversity dan temukan semua fitur yang kami sediakan untuk Anda.</p>
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

                    {/* Kolom Kanan: Informasi Tambahan */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Fitur Unggulan Kitversity</CardTitle>
                                <CardDescription>Kami menyediakan fitur-fitur ini untuk kenyamanan Anda.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {features.map((feature, index) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div key={index} className="flex items-start space-x-4">
                                            <div className="flex-shrink-0 bg-purple-100 text-purple-600 rounded-lg h-10 w-10 flex items-center justify-center">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{feature.title}</h4>
                                                <p className="text-sm text-gray-500">{feature.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Butuh Bantuan?</h3>
                            <p className="text-gray-600 mb-6">Tim kami siap membantu Anda jika mengalami kendala.</p>
                            <div className="space-y-3">
                                <Button onClick={handleWhatsAppClick} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                                    <MessageCircle className="h-5 w-5 mr-2" /> Chat via WhatsApp
                                </Button>
                                <Button asChild variant="outline" className="w-full" size="lg">
                                    <a href="mailto:admin@kitversity.com">Kirim Email</a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}