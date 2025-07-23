'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    
    // --- STATE BARU UNTUK DIALOG KONFIRMASI ---
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    const fetchOrders = useCallback(async () => {
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
    }, [toast]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    
    // --- FUNGSI BARU UNTUK PROSES HAPUS ---
    const handleDeleteClick = (orderId: number) => {
        setSelectedOrderId(orderId);
        setIsAlertOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedOrderId) return;
        try {
            const response = await fetch(`/api/orders/${selectedOrderId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal menghapus pesanan.');
            }
            toast({ title: 'Berhasil!', description: 'Pesanan telah dihapus.' });
            fetchOrders(); // Muat ulang daftar pesanan
        } catch (error) {
            toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
        } finally {
            setIsAlertOpen(false);
            setSelectedOrderId(null);
        }
    };
    // --- AKHIR FUNGSI BARU ---

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    };
    
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
        <>
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
                                <TableHead><span className="sr-only">Aksi</span></TableHead> {/* KOLOM AKSI BARU */}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.length > 0 ? orders.map((order) => (
                                <TableRow key={order.id} className="group">
                                    <TableCell onClick={() => handleRowClick(order.id)} className="font-medium cursor-pointer">#{order.id}</TableCell>
                                    <TableCell onClick={() => handleRowClick(order.id)} className="cursor-pointer">{order.customerInfo.name}</TableCell>
                                    <TableCell onClick={() => handleRowClick(order.id)} className="cursor-pointer">{formatDate(order.createdAt)}</TableCell>
                                    <TableCell onClick={() => handleRowClick(order.id)} className="cursor-pointer">
                                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell onClick={() => handleRowClick(order.id)} className="text-right cursor-pointer">{formatPrice(order.totalAmount)}</TableCell>
                                    {/* --- DROPDOWN AKSI BARU --- */}
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleRowClick(order.id)}>Lihat Detail</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteClick(order.id)} className="text-red-600 focus:bg-red-50 focus:text-red-700">Hapus</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">Belum ada pesanan.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* --- DIALOG KONFIRMASI BARU --- */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                        <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan. Pesanan akan dihapus secara permanen dari database.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Ya, Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}