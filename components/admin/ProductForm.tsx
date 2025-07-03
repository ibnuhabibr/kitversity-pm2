'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Skema validasi diperbarui
const productSchema = z.object({
  name: z.string().min(3, 'Nama produk minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  specifications: z.string().optional(), // Spesifikasi sekarang opsional
  price: z.coerce.number().positive('Harga harus lebih dari 0'),
  stock: z.coerce.number().int().nonnegative('Stok tidak boleh negatif'),
  image_url: z.string().min(1, 'URL atau Path gambar harus diisi'),
  category: z.string().min(1, 'Kategori harus diisi'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>;
  initialData?: Partial<ProductFormData> | null;
  isSubmitting?: boolean;
}

export default function ProductForm({ onSubmit, initialData, isSubmitting }: ProductFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (initialData) {
        // Jika initialData.category adalah array, gabungkan menjadi string
        const dataToSet = {
            ...initialData,
            category: Array.isArray(initialData.category)
                ? initialData.category.join(', ')
                : initialData.category,
        };
        reset(dataToSet);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Produk</Label>
        <Input id="name" {...register('name')} placeholder="e.g. Kemeja Putih Lengan Panjang" />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi Produk</Label>
        <Textarea id="description" {...register('description')} rows={4} placeholder="Jelaskan tentang produk ini..." />
        {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
      </div>

      {/* --- FIELD SPESIFIKASI BARU --- */}
      <div className="space-y-2">
        <Label htmlFor="specifications">Spesifikasi (Opsional)</Label>
        <Textarea id="specifications" {...register('specifications')} rows={6} placeholder="Bahan: Katun Oxford&#10;Model: Reguler Fit&#10;Ukuran: M, L, XL" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price">Harga</Label>
          <Input id="price" type="number" {...register('price')} placeholder="e.g. 75000" />
          {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stok</Label>
          <Input id="stock" type="number" {...register('stock')} placeholder="e.g. 100" />
          {errors.stock && <p className="text-sm text-red-600">{errors.stock.message}</p>}
        </div>
      </div>
      
      {/* --- OPSI GAMBAR BARU --- */}
      <div className="space-y-2">
        <Label htmlFor="image_url">URL Gambar atau Path Lokal</Label>
        <Input id="image_url" {...register('image_url')} placeholder="e.g. /produk1.png atau https://..." />
        <p className="text-xs text-gray-500">
          Untuk gambar lokal, pastikan file ada di folder `/public` dan awali path dengan `/`.
        </p>
        {errors.image_url && <p className="text-sm text-red-600">{errors.image_url.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Kategori (pisahkan dengan koma)</Label>
        <Input id="category" {...register('category')} placeholder="e.g. pakaian, laki-laki" />
        {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
      </div>


      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? 'Menyimpan...' : (initialData ? 'Update Produk' : 'Tambah Produk')}
        </Button>
      </div>
    </form>
  );
}