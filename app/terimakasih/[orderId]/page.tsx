// Lokasi: app/terimakasih/[orderId]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Copy, MessageCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/types/order';

export default function ThankYouPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.orderId as string;
    const { toast } = useToast();

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const whatsappGroupLink = "https://chat.whatsapp.com/Bw8P8G4UNG23FJFs6g66uI";

    useEffect(() => {
        if (!orderId) return;

        const fetchOrderDetails = async () => {
            try {
                const response = await fetch(`/api/orders?id=${orderId}`);
                if (!response.ok) {
                    throw new Error("Gagal memuat detail pesanan.");
                }
                const data = await response.json();
                setOrder(data.order);
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: "Tidak dapat menemukan detail pesanan Anda.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, toast]);

    const handleConfirmPayment = () => {
        if (!order) return;

        // Membuat format rincian pesanan lebih detail dengan varian
        const itemDetails = order.items.map(item => {
            let variantText = '';
            // Cek dan parse product_details jika ada dan valid
            if (item.product_details) {
                try {
                    const variants = JSON.parse(item.product_details);
                    // Format menjadi (Key: Value, Key: Value)
                    variantText = ` (${Object.entries(variants).map(([key, value]) => `${key}: ${value}`).join(', ')})`;
                } catch (e) {
                    console.error("Gagal parse product_details:", item.product_details, e);
                    variantText = ''; // Abaikan jika format JSON tidak valid
                }
            }

            return `- ${item.name}${variantText} (Qty: ${item.quantity}) - ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price * item.quantity)}`;
        }).join('\n');
        
        const paymentMethodText = order.paymentMethod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        const message = `*KONFIRMASI PEMBAYARAN - KITVERSITY*

Halo Admin, saya ingin mengonfirmasi pembayaran untuk pesanan berikut:
-----------------------------------
*ID Pesanan:* ${order.id}
*Tanggal:* ${new Date(order.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
-----------------------------------

*DATA PEMBELI:*
- *Nama:* ${order.customerInfo.name}
- *Email:* ${order.customerInfo.email}
- *No. WhatsApp:* ${order.customerInfo.phone}

*RINCIAN PESANAN:*
${itemDetails}

*METODE PEMBAYARAN:*
${paymentMethodText}

*TOTAL PEMBAYARAN:*
*${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.totalAmount)}*
-----------------------------------

Berikut saya lampirkan bukti pembayarannya.
Terima kasih!`;

        const whatsappUrl = `https://wa.me/6285135706028?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(whatsappGroupLink);
        toast({
            title: 'Berhasil Disalin!',
            description: 'Link grup WhatsApp telah disalin ke clipboard.',
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <Button variant="ghost" onClick={() => router.push('/')} className="mb-4 text-gray-600">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Beranda
                </Button>
                <Card className="shadow-lg text-center animate-in fade-in-50 zoom-in-95 duration-500">
                    <CardHeader className="pt-8">
                        <div className="mx-auto bg-green-100 rounded-full h-16 w-16 flex items-center justify-center">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold mt-4">Terima Kasih, {order?.customerInfo.name}!</CardTitle>
                        <CardDescription>
                            Pesananmu dengan ID <strong>{orderId}</strong> sedang menunggu konfirmasi pembayaran.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 px-6 pb-8">
                        <div>
                            <p className="text-gray-600 mb-2 text-sm">
                                Jangan lewatkan info & promo eksklusif! Gabung grup WhatsApp kami:
                            </p>
                            <div className="flex items-center space-x-2 p-2 border rounded-lg bg-gray-50">
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={whatsappGroupLink} 
                                    className="flex-1 bg-transparent outline-none text-sm text-gray-700"
                                />
                                <Button variant="ghost" size="icon" onClick={handleCopyLink} className="h-8 w-8">
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <a href={whatsappGroupLink} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm">
                                        Gabung
                                    </Button>
                                </a>
                            </div>
                        </div>
                        
                        <div className="border-t pt-6">
                            <p className="text-gray-600 mb-3 text-sm">
                                Langkah terakhir, kirim bukti pembayaranmu via WhatsApp agar pesanan segera kami proses.
                            </p>
                            <Button onClick={handleConfirmPayment} size="lg" className="w-full bg-green-600 hover:bg-green-700 font-bold" disabled={isLoading || !order}>
                                <MessageCircle className="mr-2 h-5 w-5" /> Konfirmasi & Kirim Bukti
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
