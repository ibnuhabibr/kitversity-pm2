'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Mail, Phone, Home, CreditCard, Truck, AlertCircle } from 'lucide-react';
import type { Order } from '@/types/order';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      const fetchOrderDetail = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/orders?id=${orderId}`);
          if (!response.ok) {
            throw new Error('Gagal memuat detail pesanan.');
          }
          const data = await response.json();
          setOrder(data.order);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrderDetail();
    }
  }, [orderId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };
  
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch(status) {
        case 'completed': return 'default'; // 'success' diubah menjadi 'default' (biasanya warna biru/hitam)
        case 'processing': return 'outline'; // Bisa juga 'default' jika ingin lebih menonjol
        case 'pending-payment': return 'secondary';
        default: return 'destructive';
    }
}

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-64 w-full" /></div>;
  }

  if (error) {
    return (
        <Card className="text-center py-10">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <CardTitle className="mt-4">Terjadi Kesalahan</CardTitle>
            <CardDescription>{error}</CardDescription>
            <Button onClick={() => router.back()} className="mt-6">Kembali</Button>
        </Card>
    )
  }

  if (!order) return null;

  return (
    <div className="space-y-6">
       <Button variant="outline" onClick={() => router.push('/admin/orders')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Pesanan
       </Button>

      <Card>
        <CardHeader>
          <CardTitle>Detail Pesanan #{order.id}</CardTitle>
          <CardDescription>Dipesan pada {formatDate(order.createdAt)}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
           <div className="space-y-4">
               <h3 className="font-semibold text-lg flex items-center"><User className="mr-2 h-5 w-5"/>Info Pelanggan</h3>
               <p className="flex items-center text-sm"><Mail className="mr-3 h-4 w-4 text-gray-500"/> {order.customerInfo.email}</p>
               <p className="flex items-center text-sm"><Phone className="mr-3 h-4 w-4 text-gray-500"/> {order.customerInfo.phone}</p>
           </div>
           <div className="space-y-4">
               <h3 className="font-semibold text-lg flex items-center"><Truck className="mr-2 h-5 w-5"/>Info Pengiriman</h3>
               <p className="flex items-center text-sm font-medium">{order.shippingMethod === 'cod' ? 'Ambil di Kampus (COD)' : 'Kirim ke Rumah'}</p>
               <p className="flex items-start text-sm"><Home className="mr-3 mt-1 h-4 w-4 text-gray-500 flex-shrink-0"/> {order.shippingAddress || 'Alamat tidak tersedia.'}</p>
           </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t pt-4">
            <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-500"/>
                <div>
                    <p className="text-xs text-gray-500">Metode Pembayaran</p>
                    <p className="font-medium">{order.paymentMethod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                </div>
            </div>
             <div className="text-right">
                <p className="text-xs text-gray-500">Status Pesanan</p>
                <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
            </div>
        </CardFooter>
      </Card>
      
      <Card>
          <CardHeader><CardTitle>Rincian Barang</CardTitle></CardHeader>
          <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Produk</TableHead>
                          <TableHead className="text-center">Jumlah</TableHead>
                          <TableHead className="text-right">Harga Satuan</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {order.items.map(item => (
                           <TableRow key={item.id}>
                               <TableCell className="font-medium">{item.name}</TableCell>
                               <TableCell className="text-center">{item.quantity}</TableCell>
                               <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                               <TableCell className="text-right">{formatPrice(item.price * item.quantity)}</TableCell>
                           </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-4">
              <div className="w-full max-w-xs space-y-2">
                  <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                   <div className="flex justify-between">
                      <span className="text-gray-600">Ongkos Kirim</span>
                      <span>{formatPrice(0)}</span>
                  </div>
                   <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(order.totalAmount)}</span>
                  </div>
              </div>
          </CardFooter>
      </Card>
    </div>
  );
}