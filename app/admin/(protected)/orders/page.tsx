'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // --- FUNGSI FETCH DIPERBARUI DI SINI ---
    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/orders');
                const data = await response.json();

                // Cek jika respon dari server tidak sukses (bukan status 2xx)
                if (!response.ok) {
                    throw new Error(data.error || 'Gagal memuat data pesanan.');
                }

                // Cek jika data yang diterima adalah objek & memiliki properti 'orders' yang berupa array
                if (data && Array.isArray(data.orders)) {
                    setOrders(data.orders);
                } else {
                    console.error("Format data pesanan tidak sesuai:", data);
                    setOrders([]); // Jika format aneh, set ke array kosong untuk keamanan
                }

            } catch (error) {
                console.error("Gagal mengambil data pesanan:", error);
                toast({
                    title: 'Error',
                    description: error instanceof Error ? error.message : 'Terjadi kesalahan tidak diketahui.',
                    variant: 'destructive',
                });
                setOrders([]); // Jika terjadi error, pastikan state tetap array
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, [toast]); // Tambahkan toast sebagai dependency
    // --- AKHIR PERBAIKAN ---

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Memuat Pesanan...</CardTitle>
                    <CardDescription>Mohon tunggu sebentar...</CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-64 w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Daftar Pesanan</CardTitle>
                <CardDescription>Berikut adalah semua pesanan yang masuk.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID Pesanan</TableHead>
                            <TableHead>Pelanggan</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">#{order.id}</TableCell>
                                    <TableCell>{order.customerInfo.name}</TableCell>
                                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{formatPrice(order.totalAmount)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    Belum ada pesanan yang masuk.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}