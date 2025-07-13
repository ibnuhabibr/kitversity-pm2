'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null); // State untuk menyimpan data produk
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/products/${id}`);
          if (!response.ok) {
            throw new Error('Gagal memuat detail produk.');
          }
          const data = await response.json();
          setProduct(data);
        } catch (error) {
          console.error(error);
          toast({ title: 'Error', description: 'Produk tidak ditemukan.', variant: 'destructive' });
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, toast]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal mengupdate produk.');
      }

      toast({
        title: 'Berhasil!',
        description: 'Produk telah berhasil diperbarui.',
      });
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Memuat Data Produk...</CardTitle>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[500px] w-full" />
            </CardContent>
      </Card>
    );
  }

  if (!product) {
    return <p>Produk tidak ditemukan atau gagal dimuat.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Produk</CardTitle>
        {/* --- BARIS INI YANG DIPERBAIKI --- */}
        <CardDescription>Perbarui detail untuk produk: <span className="font-semibold">{product.name}</span></CardDescription>
      </CardHeader>
      <CardContent>
        <ProductForm onSubmit={handleSubmit} initialData={product} isSubmitting={isSubmitting} />
      </CardContent>
    </Card>
  );
}