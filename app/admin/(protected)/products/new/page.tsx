'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // --- PERBAIKAN DI SINI ---
      // Pastikan varian kosong dikirim sebagai null, bukan string kosong
      const payload = {
        ...data,
        variants: data.variants ? data.variants : null,
      };
      // --- AKHIR PERBAIKAN ---

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), // Menggunakan payload yang sudah diperbaiki
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal membuat produk baru.');
      }

      toast({
        title: 'Berhasil!',
        description: 'Produk baru telah berhasil ditambahkan.',
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Produk Baru</CardTitle>
        <CardDescription>Isi semua detail produk di bawah ini.</CardDescription>
      </CardHeader>
      <CardContent>
        <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </CardContent>
    </Card>
  );
}