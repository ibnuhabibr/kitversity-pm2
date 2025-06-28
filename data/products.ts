// Lokasi: data/products.ts

import { Product } from '@/contexts/CartContext';

// Kategori baru sesuai gambar
export const categories = [
  { id: 'paket-bundling', name: 'Paket Bundling', icon: '🎁' },
  { id: 'alat-tulis', name: 'Alat Tulis', icon: '✏️' },
  { id: 'pakaian', name: 'Pakaian', icon: '👕' },
  { id: 'aksesoris', name: 'Aksesoris', icon: '🎒' },
  { id: 'laki-laki', name: 'Laki-laki', icon: '👨‍🎓' },
  { id: 'perempuan', name: 'Perempuan', icon: '👩‍🎓' }
];

// Daftar produk dengan kategori yang sudah disesuaikan ulang
export const products: Product[] = [
  {
    id: '1',
    name: 'Kemeja Putih',
    price: 75000,
    originalPrice: 107000,
    discount: 30,
    image: '/produk1.png',
    category: ['pakaian', 'laki-laki', 'perempuan'], // <-- Disesuaikan
    rating: 5.0,
    sold: 17,
    description: 'Kemeja putih lengan panjang berbahan katun Oxford yang adem dan nyaman. Pilihan utama untuk ospek, kegiatan kampus, dan acara formal.',
    specifications: 'Bahan: Katun Oxford\nWarna: Putih Bersih\nKerah: Standard\nUkuran Tersedia: S, M, L, XL, XXL',
    variants: [
      { name: 'Ukuran', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ]
  },
  {
    id: '2',
    name: 'Dasi',
    price: 15000,
    originalPrice: 21000,
    discount: 29,
    image: '/produk2.png',
    category: ['aksesoris', 'laki-laki'], // <-- Disesuaikan
    rating: 5.0,
    sold: 22,
    description: 'Dasi hitam polos standar yang wajib dimiliki untuk melengkapi penampilan formal saat ospek dan acara resmi lainnya.',
    specifications: 'Warna: Hitam Pekat\nModel: Slim Fit\nBahan: Poliester Halus'
  },
  {
    id: '3',
    name: 'Celana Pria Hitam',
    price: 85000,
    originalPrice: 121000,
    discount: 30,
    image: '/produk3.png',
    category: ['pakaian', 'laki-laki'], // <-- Disesuaikan
    rating: 5.0,
    sold: 15,
    description: 'Celana panjang bahan hitam untuk pria. Desain formal yang pas untuk kegiatan perkuliahan dan organisasi.',
    specifications: 'Bahan: High-twist\nWarna: Hitam\nModel: Regular Fit\nUkuran Pinggang: 28-38',
    variants: [
      { name: 'Ukuran', options: ['28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38'] }
    ]
  },
  {
    id: '4',
    name: 'Celana Pria Putih',
    price: 85000,
    originalPrice: 121000,
    discount: 30,
    image: '/produk17.png',
    category: ['pakaian', 'laki-laki'], // <-- Disesuaikan
    rating: 5.0,
    sold: 11,
    description: 'Celana panjang bahan putih untuk pria. Pilihan tepat untuk seragam ospek atau acara yang membutuhkan dresscode putih.',
    specifications: 'Bahan: Katun Drill\nWarna: Putih\nModel: Regular Fit\nUkuran Pinggang: 28-38',
    variants: [
      { name: 'Ukuran', options: ['28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38'] }
    ]
  },
  {
    id: '5',
    name: 'Rok Wanita Hitam',
    price: 80000,
    originalPrice: 114000,
    discount: 30,
    image: '/produk4.png',
    category: ['pakaian', 'perempuan'], // <-- Disesuaikan
    rating: 5.0,
    sold: 19,
    description: 'Rok panjang hitam model A-line untuk wanita. Terbuat dari bahan yang jatuh dan tidak mudah kusut, sopan untuk ke kampus.',
    specifications: 'Bahan: Katun Woll\nWarna: Hitam\nModel: A-Line\nUkuran: M, L, XL',
    variants: [
      { name: 'Ukuran', options: ['M', 'L', 'XL'] }
    ]
  },
  {
    id: '6',
    name: 'Rok Wanita Putih',
    price: 80000,
    originalPrice: 114000,
    discount: 30,
    image: '/produk18.png',
    category: ['pakaian', 'perempuan'], // <-- Disesuaikan
    rating: 5.0,
    sold: 13,
    description: 'Rok panjang putih model A-line untuk wanita. Bahan nyaman dan tidak menerawang, cocok untuk dresscode ospek.',
    specifications: 'Bahan: Katun Drill\nWarna: Putih\nModel: A-Line\nUkuran: M, L, XL',
    variants: [
      { name: 'Ukuran', options: ['M', 'L', 'XL'] }
    ]
  },
  {
    id: '7',
    name: 'Hijab Hitam',
    price: 20000,
    originalPrice: 29000,
    discount: 31,
    image: '/produk5.png',
    category: ['aksesoris', 'perempuan'], // <-- Disesuaikan
    rating: 5.0,
    sold: 25,
    description: 'Hijab segiempat berwarna hitam pekat yang mudah diatur dan tegak di dahi. Cocok untuk semua jenis acara.',
    specifications: 'Bahan: Voal Premium\nUkuran: 115 x 115 cm\nFinishing: Jahit Tepi Rapi',
    variants: [
      { name: 'Jenis', options: ['Voal', 'Paris Premium'] }
    ]
  },
  {
    id: '8',
    name: 'Hijab Putih',
    price: 20000,
    originalPrice: 29000,
    discount: 31,
    image: '/produk6.png',
    category: ['aksesoris', 'perempuan'], // <-- Disesuaikan
    rating: 5.0,
    sold: 21,
    description: 'Hijab segiempat berwarna putih bersih yang anggun. Mudah dibentuk dan nyaman dipakai seharian.',
    specifications: 'Bahan: Voal Premium\nUkuran: 115 x 115 cm\nFinishing: Jahit Tepi Rapi',
    variants: [
        { name: 'Jenis', options: ['Voal', 'Paris Premium'] }
      ]
  },
  {
    id: '9',
    name: 'Kaos Kaki Hitam',
    price: 15000,
    originalPrice: 21000,
    discount: 29,
    image: '/produk7.png',
    category: ['aksesoris'], // <-- Disesuaikan
    rating: 5.0,
    sold: 24,
    description: 'Kaos kaki hitam polos se-mata kaki. Bahan katun tebal yang menyerap keringat dan nyaman dipakai dengan pantofel.',
    specifications: 'Bahan: Katun Spandex\nUkuran: All Size (38-44)\nWarna: Hitam'
  },
  {
    id: '10',
    name: 'Kaos Kaki Putih',
    price: 15000,
    originalPrice: 21000,
    discount: 29,
    image: '/produk8.png',
    category: ['aksesoris'], // <-- Disesuaikan
    rating: 5.0,
    sold: 23,
    description: 'Kaos kaki putih polos se-mata kaki. Bahan katun tebal, pilihan tepat untuk kegiatan olahraga dan aktivitas kampus.',
    specifications: 'Bahan: Katun Spandex\nUkuran: All Size (38-44)\nWarna: Putih'
  },
  {
    id: '11',
    name: 'Kaos Putih Panjang',
    price: 50000,
    originalPrice: 71000,
    discount: 30,
    image: '/produk9.png',
    category: ['pakaian', 'laki-laki', 'perempuan'], // <-- Disesuaikan
    rating: 5.0,
    sold: 18,
    description: 'Kaos dalaman lengan panjang berwarna putih. Bahan adem dan nyaman, cocok dipakai di dalam kemeja.',
    specifications: 'Bahan: Cotton Combed 30s\nWarna: Putih\nUkuran: M, L, XL',
    variants: [
      { name: 'Ukuran', options: ['M', 'L', 'XL'] }
    ]
  },
  {
    id: '12',
    name: 'Celana Training',
    price: 55000,
    originalPrice: 79000,
    discount: 30,
    image: '/produk10.png',
    category: ['pakaian'], // <-- Disesuaikan
    rating: 5.0,
    sold: 12,
    description: 'Celana training unisex yang nyaman untuk kegiatan olahraga dan kepanitiaan di kampus.',
    specifications: 'Bahan: Lotto\nWarna: Hitam Strip Putih\nFitur: Saku di kanan dan kiri',
    variants: [
      { name: 'Ukuran', options: ['M', 'L', 'XL', 'XXL'] }
    ]
  },
  {
    id: '13',
    name: 'Pantofel Pria',
    price: 75000,
    originalPrice: 107000,
    discount: 30,
    image: '/produk11.png',
    category: ['aksesoris', 'laki-laki'], // <-- Disesuaikan
    rating: 5.0,
    sold: 16,
    description: 'Sepatu pantofel pria formal. Desain klasik yang awet dan nyaman, cocok untuk ospek dan kegiatan resmi.',
    specifications: 'Bahan: Kulit Sintetis Premium\nWarna: Hitam\nSol: Karet Anti-slip\nUkuran: 39-44',
    variants: [
        { name: 'Ukuran', options: ['39', '40', '41', '42', '43', '44'] }
    ]
  },
  {
    id: '14',
    name: 'Pantofel Wanita',
    price: 65000,
    originalPrice: 93000,
    discount: 30,
    image: '/produk12.png',
    category: ['aksesoris', 'perempuan'], // <-- Disesuaikan
    rating: 5.0,
    sold: 20,
    description: 'Sepatu pantofel wanita dengan hak rendah yang nyaman. Tampil elegan dan profesional di setiap kesempatan.',
    specifications: 'Bahan: Kulit Sintetis\nWarna: Hitam\nHak: 3 cm\nUkuran: 36-41',
    variants: [
        { name: 'Ukuran', options: ['36', '37', '38', '39', '40', '41'] }
    ]
  },
  {
    id: '15',
    name: 'Ikat Pinggang',
    price: 25000,
    originalPrice: 36000,
    discount: 31,
    image: '/produk13.png',
    category: ['aksesoris', 'laki-laki'], // <-- Disesuaikan
    rating: 5.0,
    sold: 25,
    description: 'Ikat pinggang formal berwarna hitam dengan kepala silver. Wajib untuk kelengkapan ospek dan seragam.',
    specifications: 'Bahan: Kulit Sintetis\nWarna: Hitam\nKepala: Logam Silver'
  },
  {
    id: '16',
    name: 'Hasduk & Rotan',
    price: 22000,
    originalPrice: 31000,
    discount: 29,
    image: '/produk14.png',
    category: ['aksesoris'], // <-- Disesuaikan
    rating: 5.0,
    sold: 14,
    description: 'Satu set hasduk pramuka lengkap dengan ring rotan. Perlengkapan wajib untuk kegiatan kepramukaan di kampus.',
    specifications: 'Bahan Hasduk: Katun\nRing: Rotan Asli'
  },
  {
    id: '17',
    name: 'Pin Garuda',
    price: 7000,
    originalPrice: 10000,
    discount: 30,
    image: '/produk15.png',
    category: ['aksesoris'], // <-- Disesuaikan
    rating: 5.0,
    sold: 22,
    description: 'Pin lambang Garuda Pancasila dengan detail yang tajam dan warna emas yang cerah. Pengait peniti yang kuat.',
    specifications: 'Bahan: Logam Kuningan\nPengait: Peniti'
  },
  {
    id: '18',
    name: 'Pin Bendera',
    price: 7000,
    originalPrice: 10000,
    discount: 30,
    image: '/produk16.png',
    category: ['aksesoris'], // <-- Disesuaikan
    rating: 5.0,
    sold: 20,
    description: 'Pin bendera Merah Putih dengan kualitas terbaik. Warna cerah dan tidak mudah luntur. Pengait peniti yang kuat.',
    specifications: 'Bahan: Logam & Resin\nPengait: Peniti'
  },
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