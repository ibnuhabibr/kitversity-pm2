'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // --- FUNGSI FETCH DIPERBARUI DI SINI ---
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/products');
            const data = await response.json();

            // PERIKSA APAKAH RESPON DARI API SUKSES
            if (!response.ok) {
                // Jika tidak, lempar error dengan pesan dari API
                throw new Error(data.error || 'Gagal memuat produk.');
            }

            // PASTIKAN DATA YANG DITERIMA ADALAH ARRAY
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                console.error("Data produk yang diterima bukan array:", data);
                // Set ke array kosong untuk menghindari error .map
                setProducts([]);
            }

        } catch (error) {
            console.error("Gagal mengambil data produk:", error);
            toast({ 
                title: 'Error', 
                description: error instanceof Error ? error.message : 'Terjadi kesalahan tidak diketahui.', 
                variant: 'destructive' 
            });
            setProducts([]); // Pastikan state tetap array jika ada error
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);
    // --- AKHIR PERBAIKAN ---

    const handleDelete = async (productId: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            return;
        }
        // Implementasi API DELETE di sini
        console.log(`Menghapus produk dengan ID: ${productId}`);
        toast({ title: 'Info', description: 'Fitur hapus belum diimplementasikan di API.' });
    };
    
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Memuat Produk...</CardTitle>
                    <CardDescription>Mohon tunggu sebentar...</CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-96 w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manajemen Produk</CardTitle>
                    <CardDescription>Tambah, edit, atau hapus produk Anda di sini.</CardDescription>
                </div>
                <Button asChild>
                    <Link href="/admin/products/new">
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Produk
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">Gambar</TableHead>
                            <TableHead>Nama Produk</TableHead>
                            <TableHead>Stok</TableHead>
                            <TableHead className="text-right">Harga</TableHead>
                            <TableHead>
                                <span className="sr-only">Aksi</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="hidden sm:table-cell">
                                    <Image
                                        alt={product.name}
                                        className="aspect-square rounded-md object-cover"
                                        height="64"
                                        src={product.image_url || '/placeholder.svg'}
                                        width="64"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell className="text-right">{formatPrice(product.price)}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(product.id)}>
                                                Hapus
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}