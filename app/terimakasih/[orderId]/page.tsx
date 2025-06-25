'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Copy, MessageCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ThankYouPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.orderId as string;
    const { toast } = useToast();

    const whatsappGroupLink = "https://chat.whatsapp.com/ContohLinkGrup";

    const handleCopyLink = () => {
        navigator.clipboard.writeText(whatsappGroupLink);
        toast({
            title: "Link Grup WhatsApp Disalin!",
            description: "Silakan bergabung untuk info dan promo menarik.",
        });
    };

    const handleConfirmPayment = () => {
        const message = `Halo Admin Kitversity, saya ingin konfirmasi pembayaran untuk pesanan ID: ${orderId}.\n\nBerikut saya lampirkan bukti pembayarannya. Terima kasih.`;
        const whatsappUrl = `https://wa.me/6285135706028?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

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
                        <CardTitle className="text-2xl font-bold mt-4">Terima Kasih!</CardTitle>
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
                                <Button variant="ghost" size="sm" onClick={handleCopyLink}>
                                    <Copy className="h-4 w-4 mr-1" /> Salin
                                </Button>
                            </div>
                        </div>
                        
                        <div className="border-t pt-6">
                            <p className="text-gray-600 mb-3 text-sm">
                                Langkah terakhir, kirim bukti pembayaranmu via WhatsApp agar pesanan segera kami proses.
                            </p>
                            <Button onClick={handleConfirmPayment} size="lg" className="w-full bg-green-600 hover:bg-green-700 font-bold">
                                <MessageCircle className="mr-2 h-5 w-5" /> Konfirmasi & Kirim Bukti
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
