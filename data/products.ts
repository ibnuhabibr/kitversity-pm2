// Lokasi: data/products.ts

import { Product } from '@/contexts/CartContext';

export const categories = [
  { id: 'paket-bundling', name: 'Paket Bundling', icon: '🎁' },
  { id: 'alat-tulis', name: 'Alat Tulis', icon: '✏️' },
  { id: 'pakaian', name: 'Pakaian', icon: '👕' },
  { id: 'aksesoris', name: 'Aksesoris', icon: '🎒' },
  { id: 'laki-laki', name: 'Laki-laki', icon: '👨‍🎓' },
  { id: 'perempuan', name: 'Perempuan', icon: '👩‍🎓' }
];

// Daftar produk dengan deskripsi dan spesifikasi yang telah diperbarui
export const products: Product[] = [
  {
    id: '1',
    name: 'Notebook',
    price: 15000,
    originalPrice: 25000,
    discount: 40,
    image: '/produk22.jpg',
    category: ['alat-tulis', 'aksesoris', 'laki-laki', 'perempuan'],
    rating: 5.0,
    sold: 50,
    description: 'Notebook berkualitas tinggi untuk penugasan kampus. Kertas tebal dan tidak mudah sobek, cocok untuk menulis, menggambar, atau mencatat materi kuliah. Desain minimalis dan elegan.',
    specifications: `Ukuran: A5 (14.8 x 21 cm)
Jumlah Halaman: 100 lembar
Kertas: 70 gsm, tidak mudah sobek
Cover: Soft cover dengan desain minimalis
Binding: Spiral binding yang kuat
Warna: Hitam dengan aksen emas`,
    available: true
  },
  {
    id: '2',
    name: 'ID Card',
    price: 12000,
    originalPrice: 15000,
    discount: 20,
    image: '/produk23.jpg',
    category: ['aksesoris', 'laki-laki', 'perempuan'],
    rating: 5.0,
    sold: 35,
    description: 'ID Card berkualitas tinggi untuk keperluan identitas mahasiswa. Terbuat dari bahan PVC yang tahan lama dan tidak mudah rusak. Cocok untuk kartu mahasiswa, kartu anggota organisasi, atau keperluan identitas lainnya.',
    specifications: `Ukuran: 85.6 x 54 mm (standar ISO)
Bahan: PVC berkualitas tinggi
Ketebalan: 0.76 mm
Finishing: Laminasi glossy
Fitur: Tahan air dan tidak mudah pudar
Desain: Dapat disesuaikan dengan kebutuhan`,
    available: true
  },
  {
    id: '3',
    name: 'Bundling Notebook + ID Card',
    price: 25000,
    originalPrice: 35000,
    discount: 28,
    image: '/produk24.jpg',
    category: ['paket-bundling', 'alat-tulis', 'aksesoris', 'laki-laki', 'perempuan'],
    rating: 5.0,
    sold: 25,
    description: 'Paket hemat bundling notebook dan ID card untuk kebutuhan mahasiswa. Dapatkan kedua produk berkualitas dengan harga lebih ekonomis. Cocok untuk persiapan kuliah atau sebagai hadiah untuk mahasiswa baru.',
    specifications: `Paket berisi:
• 1x Notebook A5 (100 lembar, kertas 70 gsm)
• 1x ID Card PVC (85.6 x 54 mm)

Keunggulan bundling:
• Hemat Rp 3.000 dari harga satuan
• Kualitas terjamin untuk kedua produk
• Cocok untuk mahasiswa baru
• Kemasan menarik`,
    available: true
  }
];

// Fungsi-fungsi di bawah ini tidak perlu diubah
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category.includes(category));
};

export const searchProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.some(cat => cat.toLowerCase().includes(searchTerm))
  );
};