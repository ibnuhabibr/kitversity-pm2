'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';

// Skema validasi diperbarui untuk mencakup semua field baru
const productSchema = z.object({
  name: z.string().min(3, 'Nama produk minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  specifications: z.string().optional(),
  price: z.coerce.number().positive('Harga harus lebih dari 0'),
  originalPrice: z.coerce.number().nonnegative('Harga asli tidak boleh negatif').optional(),
  discount: z.coerce.number().int().nonnegative('Diskon tidak boleh negatif').optional(),
  stock: z.coerce.number().int().nonnegative('Stok tidak boleh negatif'),
  image_url: z.string().min(1, 'URL atau Path gambar harus diisi'),
  category: z.string().min(1, 'Kategori harus diisi'),
  rating: z.coerce.number().min(0).max(5).optional(),
  sold: z.coerce.number().int().nonnegative('Jumlah terjual tidak boleh negatif').optional(),
  variants: z.string().optional(),
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

      <div className="space-y-2">
        <Label htmlFor="specifications">Spesifikasi (Opsional)</Label>
        <Textarea id="specifications" {...register('specifications')} rows={6} placeholder="Bahan: Katun Oxford&#10;Model: Reguler Fit&#10;Ukuran: M, L, XL" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price">Harga Jual</Label>
          <Input id="price" type="number" {...register('price')} placeholder="e.g. 75000" />
          {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="originalPrice">Harga Asli (Opsional)</Label>
          <Input id="originalPrice" type="number" {...register('originalPrice')} placeholder="e.g. 10700" />
          {errors.originalPrice && <p className="text-sm text-red-600">{errors.originalPrice.message}</p>}
        </div>
         <div className="space-y-2">
          <Label htmlFor="discount">Diskon (%) (Opsional)</Label>
          <Input id="discount" type="number" {...register('discount')} placeholder="e.g. 30" />
          {errors.discount && <p className="text-sm text-red-600">{errors.discount.message}</p>}
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="stock">Stok</Label>
          <Input id="stock" type="number" {...register('stock')} placeholder="e.g. 100" />
          {errors.stock && <p className="text-sm text-red-600">{errors.stock.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (Opsional)</Label>
          <Input id="rating" type="number" step="0.1" {...register('rating')} placeholder="e.g. 5.0" />
          {errors.rating && <p className="text-sm text-red-600">{errors.rating.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="sold">Jumlah Terjual (Opsional)</Label>
          <Input id="sold" type="number" {...register('sold')} placeholder="e.g. 30" />
          {errors.sold && <p className="text-sm text-red-600">{errors.sold.message}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image_url">URL Gambar atau Path Lokal</Label>
        <Input id="image_url" {...register('image_url')} placeholder="e.g. /produk1.png atau https://..." />
        <p className="text-xs text-gray-500">
          Untuk gambar lokal, pastikan file ada di folder `/public` dan awali path dengan `/`.
        </p>
        {errors.image_url && <p className="text-sm text-red-600">{errors.image_url.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Kategori (pisahkan dengan koma dan spasi)</Label>
        <Input id="category" {...register('category')} placeholder="e.g. aksesoris, laki-laki, perempuan" />
        {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
      </div>
      
       <div className="space-y-2">
        <Label htmlFor="variants">Varian Produk (Format JSON, Opsional)</Label>
        <Textarea id="variants" {...register('variants')} rows={4} placeholder='[{"name":"Ukuran","options":["M","L","XL"]},{"name":"Warna","options":["Hitam","Putih"]}]' />
        <p className="text-xs text-gray-500">
          Gunakan format JSON yang valid. Kosongkan jika tidak ada varian.
        </p>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? 'Menyimpan...' : (initialData ? 'Update Produk' : 'Tambah Produk')}
        </Button>
      </div>
    </form>
  );
}