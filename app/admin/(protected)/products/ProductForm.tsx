'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

// Skema validasi menggunakan Zod
const productSchema = z.object({
  name: z.string().min(3, { message: 'Nama produk minimal 3 karakter' }),
  description: z.string().min(10, { message: 'Deskripsi minimal 10 karakter' }),
  price: z.coerce.number().min(1, { message: 'Harga tidak boleh kosong' }),
  stock: z.coerce.number().min(0, { message: 'Stok tidak boleh negatif' }),
  image_url: z.string().url({ message: 'URL gambar tidak valid' }).or(z.literal('')),
  category: z.string().min(1, { message: 'Kategori harus diisi' }),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>;
  initialData?: Partial<ProductFormData>;
}

export default function ProductForm({ onSubmit, initialData }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      image_url: '',
      category: '',
    },
  });

  const handleFormSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setIsSubmitting(true);
    await onSubmit(data);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Produk</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Kategori (pisahkan dengan koma)</Label>
          <Input id="category" {...register('category')} placeholder="e.g. pakaian, laki-laki" />
          {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea id="description" {...register('description')} rows={5} />
        {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price">Harga</Label>
          <Input id="price" type="number" {...register('price')} />
          {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stok</Label>
          <Input id="stock" type="number" {...register('stock')} />
          {errors.stock && <p className="text-sm text-red-600">{errors.stock.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">URL Gambar</Label>
        <Input id="image_url" {...register('image_url')} placeholder="https://..." />
        {errors.image_url && <p className="text-sm text-red-600">{errors.image_url.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
        </Button>
      </div>
    </form>
  );
}