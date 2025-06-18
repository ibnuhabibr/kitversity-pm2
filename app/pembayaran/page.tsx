// Lokasi: app/pembayaran/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useCart, type CartItem } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter, 
  DialogClose   
} from '@/components/ui/dialog';


export default function PaymentPage() {
  const router = useRouter();
  const { state: cartState, clearCart } = useCart();
  const { toast } = useToast();

  const [itemsToPay, setItemsToPay] = useState<CartItem[]>([]);
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State untuk form data diri, sekarang dengan nomor telepon
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [domicileType, setDomicileType] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(''); // <-- TAMBAHAN: State untuk nomor telepon
  const [shippingMethod, setShippingMethod] = useState('');

  // useEffect untuk menentukan item mana yang harus ditampilkan
  useEffect(() => {
    const buyNowData = sessionStorage.getItem('buyNowItem');
    if (buyNowData) {
      setItemsToPay(JSON.parse(buyNowData));
      setIsBuyNow(true);
      // Dulu: removeItem ada di sini, ini yang bikin bug. Sekarang udah dihapus.
    } else {
      setItemsToPay(cartState.items);
      setIsBuyNow(false);
    }
    // Dependency array dikosongkan agar hanya jalan sekali saat komponen pertama kali mount
  }, []);

  const totalPrice = itemsToPay.reduce((total, item) => total + item.price * item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };
  
  const handleSendToWhatsApp = () => {
    // Tambahkan validasi untuk nomor telepon
    if (!name || !university || !domicileType || !address || !shippingMethod || !phone) {
      toast({
        title: 'Form Belum Lengkap',
        description: 'Mohon isi semua data diri yang diperlukan, termasuk nomor telepon.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);

    const productDetails = itemsToPay.map(item => 
      `- ${item.name} (Qty: ${item.quantity}) @ ${formatPrice(item.price)}`
    ).join('\n');

    // Tambahkan nomor telepon ke template pesan
    const message = `Halo Admin Kitversity, saya mau konfirmasi pesanan:

*Produk yang Dipesan:*
${productDetails}
-----------------------------------
*Total Harga: ${formatPrice(totalPrice)}*
-----------------------------------

*Data Pemesan:*
Nama: ${name}
Nomor Telepon: ${phone}
Asal Universitas: ${university}
Domisili: ${domicileType} - ${address}
Metode Pengiriman: ${shippingMethod}

Mohon info lanjut untuk proses pembayaran dan pengiriman. Terima kasih!`;

    const whatsappUrl = `https://wa.me/6285135706028?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Logika penghapusan data dipindah ke sini, setelah proses selesai
    if (isBuyNow) {
      // Jika 'Beli Langsung', HAPUS item dari sessionStorage
      sessionStorage.removeItem('buyNowItem');
    } else {
      // Jika dari keranjang biasa, BARU clear cart utama
      clearCart();
    }
    
    toast({
      title: 'Pesanan Diteruskan!',
      description: 'Anda akan diarahkan ke WhatsApp untuk konfirmasi dengan admin.',
      variant: 'default'
    });
    
    router.push('/');
    setIsLoading(false);
  };


  if (itemsToPay.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <CreditCard className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tidak Ada Item untuk Dibayar</h1>
          <p className="text-gray-600 mb-8">Keranjang Anda kosong. Yuk mulai belanja!</p>
          <Button asChild size="lg"><Link href="/produk">Mulai Belanja</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Ringkasan & Pembayaran</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* KOLOM KIRI: Daftar Produk */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Produk yang akan dibayar</h2>
              <div className="space-y-4">
                {itemsToPay.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.quantity} x {formatPrice(item.price)}</p>
                    </div>
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: Ringkasan Harga & Tombol Aksi */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Total Pesanan</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({itemsToPay.reduce((sum, item) => sum + item.quantity, 0)} item)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ongkos Kirim</span>
                  <span className="font-medium text-sm text-blue-600">Dikonfirmasi via WA</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">{formatPrice(totalPrice)}</span>
                </div>
                <p className="text-xs text-gray-500 italic">* Belum termasuk ongkos kirim.</p>
              </div>
              
              <Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600" size="lg">
                      Lanjut ke Pengisian Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Konfirmasi Pesanan</AlertDialogTitle>
                      <AlertDialogDescription>
                        Anda akan melanjutkan proses dengan item berikut. Pastikan pesanan Anda sudah benar sebelum mengisi data diri.
                        <ul className="list-disc pl-5 mt-2 text-gray-700">
                          {itemsToPay.map(item => <li key={item.id}>{item.name} (x{item.quantity})</li>)}
                        </ul>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <DialogTrigger asChild>
                        <AlertDialogAction>Lanjut</AlertDialogAction>
                      </DialogTrigger>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Lengkapi Data Diri</DialogTitle>
                    <DialogDescription>
                      Data ini akan digunakan untuk konfirmasi via WhatsApp.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="bg-gray-100 p-3 rounded-md">
                      <Label className="font-semibold">Ringkasan Pesanan</Label>
                      <ul className="text-xs list-disc pl-4 mt-1 text-gray-600">
                         {itemsToPay.map(item => <li key={item.id}>{item.name} (x{item.quantity})</li>)}
                      </ul>
                      <p className="text-sm font-bold mt-2">Total: {formatPrice(totalPrice)}</p>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Nama</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="Nama Lengkap" />
                    </div>
                     {/* TAMBAHAN: Form Nomor Telepon */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">No. Telp/WA</Label>
                      <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" placeholder="08xxxxxxxxxx" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="university" className="text-right">Universitas</Label>
                      <Input id="university" value={university} onChange={(e) => setUniversity(e.target.value)} className="col-span-3" placeholder="Asal Universitas" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                       <Label className="text-right">Domisili</Label>
                       <RadioGroup onValueChange={setDomicileType} className="col-span-3 flex gap-4">
                         <div className="flex items-center space-x-2"><RadioGroupItem value="Kost" id="r1" /><Label htmlFor="r1">Kost</Label></div>
                         <div className="flex items-center space-x-2"><RadioGroupItem value="Rumah" id="r2" /><Label htmlFor="r2">Rumah</Label></div>
                       </RadioGroup>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="address" className="text-right">Alamat</Label>
                      <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="col-span-3" placeholder="Alamat lengkap domisili" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                       <Label className="text-right">Pengiriman</Label>
                       <RadioGroup onValueChange={setShippingMethod} className="col-span-3 flex flex-col gap-2">
                         <div className="flex items-center space-x-2"><RadioGroupItem value="Kirim Luar Surabaya" id="s1" /><Label htmlFor="s1">Kirim Luar Surabaya</Label></div>
                         <div className="flex items-center space-x-2"><RadioGroupItem value="Kirim Area Surabaya" id="s2" /><Label htmlFor="s2">Kirim Area Surabaya</Label></div>
                         <div className="flex items-center space-x-2"><RadioGroupItem value="COD (Kampus UNAIR)" id="s3" /><Label htmlFor="s3">COD (Kampus UNAIR)</Label></div>
                       </RadioGroup>
                    </div>
                  </div>
                  <DialogFooter className="flex-col items-start">
                     <p className="text-xs text-gray-500 italic w-full mb-2">
                        *Untuk detail total akhir & pembayaran akan dilanjutkan melalui admin @Kitversity di WhatsApp.
                     </p>
                     <Button type="button" onClick={handleSendToWhatsApp} className="w-full" disabled={isLoading}>
                       {isLoading ? 'Memproses...' : 'Kirim Pesanan ke WhatsApp'}
                     </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}