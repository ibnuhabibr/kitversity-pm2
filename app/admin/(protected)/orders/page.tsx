'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function OrdersPage() {
    const router = useRouter(); // <-- Tambahkan ini
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/orders');
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Gagal memuat pesanan');
                setOrders(data.orders || []);
            } catch (error) {
                console.error("Gagal mengambil data pesanan:", error);
                toast({ title: 'Error', description: 'Gagal memuat pesanan.', variant: 'destructive' });
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, [toast]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    };
    
    // --- FUNGSI BARU UNTUK NAVIGASI ---
    const handleRowClick = (orderId: number) => {
        router.push(`/admin/orders/${orderId}`);
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader><CardTitle>Memuat Pesanan...</CardTitle></CardHeader>
                <CardContent><Skeleton className="h-64 w-full" /></CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Daftar Pesanan</CardTitle>
                 <CardDescription>Klik sebuah pesanan untuk melihat detailnya.</CardDescription>
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
                        {orders.length > 0 ? orders.map((order) => (
                            // --- TAMBAHKAN onClick dan class cursor-pointer ---
                            <TableRow key={order.id} onClick={() => handleRowClick(order.id)} className="cursor-pointer hover:bg-gray-50">
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
                        )) : (
                             <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">Belum ada pesanan.</TableCell>
                             </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}