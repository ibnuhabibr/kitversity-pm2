import { Product } from '@/contexts/CartContext';

export const categories = [
  { id: 'alat-tulis', name: 'Alat Tulis', icon: '✏️' },
  { id: 'tas-pouch', name: 'Tas & Pouch', icon: '🎒' },
  { id: 'pakaian', name: 'Pakaian', icon: '👕' },
  { id: 'elektronik', name: 'Elektronik', icon: '💻' },
  { id: 'buku', name: 'Buku & Modul', icon: '📚' },
  { id: 'kesehatan', name: 'Kesehatan', icon: '🏥' }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Paket Alat Tulis Lengkap Mahasiswa',
    price: 89000,
    originalPrice: 120000,
    image: 'https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg',
    category: 'alat-tulis',
    rating: 5.0,
    sold: 45,
    discount: 26,
    description: 'Paket lengkap alat tulis untuk mahasiswa baru yang berisi pulpen, pensil, penggaris, penghapus, dan perlengkapan tulis lainnya.',
    specifications: 'Berisi: 5 pulpen (biru, hitam, merah), 3 pensil 2B, 1 penggaris 30cm, 2 penghapus, 1 tip-ex, 1 stabilo kuning, 1 stapler mini'
  },
  {
    id: '2',
    name: 'Tas Ransel Anti Air Mahasiswa',
    price: 185000,
    originalPrice: 250000,
    image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
    category: 'tas-pouch',
    rating: 5.0,
    sold: 32,
    discount: 26,
    description: 'Tas ransel berkualitas tinggi dengan material anti air, cocok untuk mahasiswa aktif.',
    specifications: 'Material: Oxford 600D waterproof, Kapasitas: 25L, Fitur: USB charging port, anti theft zipper, laptop compartment'
  },
  {
    id: '3',
    name: 'Kaos Polos Premium Cotton',
    price: 45000,
    originalPrice: 65000,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    category: 'pakaian',
    rating: 4.9,
    sold: 58,
    discount: 31,
    description: 'Kaos polos berbahan cotton premium yang nyaman dipakai sehari-hari.',
    specifications: 'Bahan: 100% Cotton Combed 30s, Ukuran: S, M, L, XL, XXL, Warna: Putih, Hitam, Navy, Abu-abu',
    variants: [
      { name: 'Ukuran', options: ['S', 'M', 'L', 'XL', 'XXL'] },
      { name: 'Warna', options: ['Putih', 'Hitam', 'Navy', 'Abu-abu'] }
    ]
  },
  {
    id: '4',
    name: 'Mouse Wireless Gaming',
    price: 125000,
    originalPrice: 180000,
    image: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg',
    category: 'elektronik',
    rating: 4.9,
    sold: 28,
    discount: 31,
    description: 'Mouse wireless dengan DPI tinggi untuk gaming dan produktivitas.',
    specifications: 'DPI: up to 3200, Battery life: 12 months, Wireless range: 10m, Compatible: Windows, Mac, Linux'
  },
  {
    id: '5',
    name: 'Buku Panduan Mahasiswa Baru',
    price: 35000,
    image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
    category: 'buku',
    rating: 5.0,
    sold: 41,
    description: 'Panduan lengkap untuk mahasiswa baru berisi tips dan trik sukses di perkuliahan.',
    specifications: 'Halaman: 200, Ukuran: A5, Penerbit: Kitversity Press, Bahasa: Indonesia'
  },
  {
    id: '6',
    name: 'Masker Kain 3 Ply Premium',
    price: 25000,
    originalPrice: 35000,
    image: 'https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg',
    category: 'kesehatan',
    rating: 5.0,
    sold: 52,
    discount: 29,
    description: 'Masker kain 3 lapis dengan filter yang dapat dicuci dan digunakan berulang.',
    specifications: 'Material: Cotton blend, Lapisan: 3 layer, Filter: Replaceable, Ukuran: Dewasa, Warna: Hitam, Biru, Putih'
  },
  {
    id: '7',
    name: 'Pouch Organizer Serbaguna',
    price: 55000,
    originalPrice: 75000,
    image: 'https://images.pexels.com/photos/3766111/pexels-photo-3766111.jpeg',
    category: 'tas-pouch',
    rating: 4.9,
    sold: 37,
    discount: 27,
    description: 'Pouch organizer dengan berbagai kompartemen untuk menyimpan alat tulis dan gadget.',
    specifications: 'Material: Canvas, Ukuran: 25x15x8cm, Kompartemen: 8 slot, Zipper: YKK, Warna: Navy, Hitam, Khaki'
  },
  {
    id: '8',
    name: 'Powerbank 10000mAh Fast Charge',
    price: 150000,
    originalPrice: 200000,
    image: 'https://images.pexels.com/photos/4502492/pexels-photo-4502492.jpeg',
    category: 'elektronik',
    rating: 5.0,
    sold: 24,
    discount: 25,
    description: 'Powerbank berkapasitas besar dengan teknologi fast charging untuk semua device.',
    specifications: 'Kapasitas: 10000mAh, Output: 2.1A, Input: Micro USB + Type-C, LED indicator, Safety protection'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const searchProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
};