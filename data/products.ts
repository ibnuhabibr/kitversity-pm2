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
    id: '20',
    name: 'Notebook',
    price: 19000,
    originalPrice: 25000,
    discount: 24,
    image: '/produk22.png',
    category: ['alat-tulis', 'aksesoris', 'laki-laki', 'perempuan'],
    rating: 5.0,
    sold: 32,
    description: 'Notebook berkualitas tinggi untuk keperluan Amerta.',
    specifications: `Sesuai dengan ketentuan terbaru Amerta 2025`,
    available: true
  },
  {
    id: '21',
    name: 'ID Card (FREE PASFOTO & PITA)',
    price: 14000,
    originalPrice: 20000,
    discount: 30,
    image: '/produk23.png',
    category: ['aksesoris', 'laki-laki', 'perempuan'],
    rating: 5.0,
    sold: 54,
    description: 'ID Card berkualitas tinggi untuk keperluan Amerta',
    specifications: `Gratis Pasfoto & Pita, Sesuai dengan ketentuan terbaru Amerta 2025`,
    available: true
  },
  {
    id: '22',
    name: 'BUNDLING (Paket berisi: Notebook, ID Card, Pasfoto, Pita, Janji Mahasiswa, dan Hymne Airlangga)',
    price: 28000,
    originalPrice: 45000,
    discount: 37,
    image: '/produk24.png',
    category: ['paket-bundling', 'alat-tulis', 'aksesoris', 'laki-laki', 'perempuan'],
    rating: 5.0,
    sold: 18,
    description: 'Paket hemat bundling notebook dan ID card untuk kebutuhan Amerta',
    specifications: `Paket berisi: Notebook, ID Card, Pasfoto, Pita, Janji Mahasiswa, dan Hymne Airlangga`,
    available: true
  },
  {
    id: '1',
    name: 'Kemeja Putih',
    price: 75000,
    originalPrice: 107000,
    discount: 30,
    image: '/produk1.png',
    category: ['pakaian', 'laki-laki', 'perempuan'],
    rating: 5.0,
    sold: 17,
    description: 'Kemeja putih lengan panjang berbahan katun Oxford yang adem dan nyaman dipakai. Pilihan utama untuk ospek, kegiatan kampus, dan berbagai acara formal lainnya. Dibuat dengan standar ukuran nasional yang pas.',
    specifications: `Bahan: Katun Oxford (Tidak panas saat dipakai)
Model: Reguler Fit (Standar Nasional)

DETAIL UKURAN (Toleransi 1-2cm):
• Size M (15): Lingkar Dada 104cm, Panjang Baju 65cm
• Size L (15.5): Lingkar Dada 108cm, Panjang Baju 67cm
• Size XL (16): Lingkar Dada 112cm, Panjang Baju 68cm
• Size XXL (16.5): Lingkar Dada 116cm, Panjang Baju 69cm
• Size XXXL (17): Lingkar Dada 122cm, Panjang Baju 72cm`,
    variants: [
      { name: 'Ukuran', options: ['M', 'L', 'XL', 'XXL', 'XXXL'] }
    ],
    available: false
  },
  {
    id: '2',
    name: 'Dasi',
    price: 15000,
    originalPrice: 21000,
    discount: 29,
    image: '/produk2.png',
    category: ['aksesoris', 'laki-laki', 'perempuan'],
    rating: 5.0,
    sold: 22,
    description: 'Dasi hitam polos untuk pria dan wanita. Desain formal yang pas untuk melengkapi penampilan saat ospek, kerja, dan acara resmi lainnya.',
    specifications: `Warna: Hitam Pekat
Model: Slim Fit / Formal Standard
Bahan: Poliester Halus`,
    available: false
  },
  {
    id: '3',
    name: 'Celana Pria Hitam',
    price: 85000,
    originalPrice: 121000,
    discount: 30,
    image: '/produk3.png',
    category: ['pakaian', 'laki-laki'],
    rating: 5.0,
    sold: 15,
    description: 'Celana bahan slim-fit yang dirancang untuk tampilan modern dan profesional. Terbuat dari material Semi Woll Exclusive yang halus, ringan, dan anti kusut, celana ini sangat nyaman dipakai untuk acara formal maupun semi-formal.',
    specifications: `Model: Slim Fit
Material: Semi Woll Exclusive (Halus, Ringan, Anti Kusut)
Keunggulan:
• Jahitan Rapih & Mudah Disetrika
• Adem dan Nyaman Dipakai
• Cocok untuk Tampil Lebih Muda

SIZE CHART (Lingkar Pinggang / Lingkar Kaki / Panjang Celana 98-100cm):
• Size 27: LP 72cm / LK 32cm
• Size 28: LP 74cm / LK 32cm
• Size 29: LP 76cm / LK 34cm
• Size 30: LP 79cm / LK 34cm
• Size 31: LP 82cm / LK 36cm
• Size 32: LP 84cm / LK 36cm
• Size 33: LP 87cm / LK 37cm
• Size 34: LP 89cm / LK 37cm
• Size 35: LP 92cm / LK 38cm
• Size 36: LP 94cm / LK 38cm
• Size 37: LP 96cm / LK 39cm
• Size 38: LP 98cm / LK 39cm`,
    variants: [
      { name: 'Ukuran', options: ['27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38'] }
    ],
    available: false
  },
  {
    id: '4',
    name: 'Celana Pria Putih',
    price: 85000,
    originalPrice: 121000,
    discount: 30,
    image: '/produk17.png',
    category: ['pakaian', 'laki-laki'],
    rating: 5.0,
    sold: 11,
    description: 'Celana kantor slim-fit berwarna putih yang elegan, cocok untuk seragam ospek atau acara yang membutuhkan dresscode khusus. Dibuat dengan bahan wool tebal yang stretch, tidak mudah kusut, dan dilengkapi resleting YKK yang kuat.',
    specifications: `Bahan: Wool Tebal (Stretch, tidak mudah kusut, tidak mudah berbulu)
Resleting: YKK Original
Fitur: Kantong full paping (tidak mudah jebol)

SIZE CHART (Lingkar Pinggang / Panjang Celana 98-100cm):
• UK. 27: 70-72cm
• UK. 28: 74cm
• UK. 29: 76cm
• UK. 30: 78cm
• UK. 31: 80cm
• UK. 32: 82cm
• UK. 33: 84cm
• UK. 34: 86cm
• UK. 35: 88cm
• UK. 36: 90cm
• UK. 37: 92-93cm
• UK. 38: 94-96cm
(Toleransi ukuran 1-2cm)`,
    variants: [
      { name: 'Ukuran', options: ['26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38'] }
    ],
    available: false
  },
  {
    id: '5',
    name: 'Rok Wanita Hitam',
    price: 80000,
    originalPrice: 114000,
    discount: 30,
    image: '/produk4.png',
    category: ['pakaian', 'perempuan'],
    rating: 5.0,
    sold: 19,
    description: 'Tampil memesona dengan rok span hitam yang tak terlupakan. Dengan sentuhan rempel belakang yang memukau, rok ini menghadirkan feminitas dan keanggunan untuk momen istimewa Anda. Dirancang dari bahan semi woll berkualitas, memberikan penampilan mewah sekaligus kenyamanan tanpa kompromi.',
    specifications: `MATRIAL BAHAN/KAIN : "MELENIUM"

√ TEBAL
√ HALUS
√ JATUH&LICIN

UKURAN : S,M,L,XL

WARNA : HITAM,COKLAT,BIRU

MODEL A LINE PINGGANG KARET SAMPING

*KANCING HAG DALAM
*RESLETING DIBAGIAN BELAKANG
*TERDAPAT KANTONG SAKU
*ADA KOLONG BUAT IKAT PINGGANG

KETERANGAN UKURAN :

SIZE S
PANJANG : 91 CM
LINGKAR PINGGANG : 66 CM ( NORMAL ) SETELAH MULUR 80 CM
LINGKAR BAWAH : 122 CM ( MELINGKAR )
PERKIRAAN BB : 40-45 KG

SIZE M
PANJANG : 93 CM
LINGKAR PINGGANG : 68 CM ( NORMAL ) SETELAH MULUR 82 CM
LINGKAR BAWAH : 124 CM ( MELINGKAR )
PERKIRAAN BB : 46-50 KG

SIZE L
PANJANG :94 CM
LINGKAR PINGGANG : 70 CM ( NORMAL ) SETELAH MULUR 98 CM
LINGKAR BAWAH : 125 CM ( MELINGKAR )
PERKIRAAN BB : 51-55 KG

SIZE XL
PANJANG :94 CM
LINGKAR PINGGANG : 72 CM ( NORMAL ) SETELAH MULUR 110 CM
LINGKAR BAWAH : 126 CM ( MELINGKAR )
PERKIRAAN BB : 56-65 KG`,
    variants: [
      { name: 'Ukuran', options: ['S', 'M', 'L', 'XL'] }
    ],
    available: false
  },
  {
    id: '6',
    name: 'Rok Wanita Putih',
    price: 80000,
    originalPrice: 114000,
    discount: 30,
    image: '/produk18.png',
    category: ['pakaian', 'perempuan'],
    rating: 5.0,
    sold: 13,
    description: 'Tampil anggun dengan rok span putih yang elegan. Dengan sentuhan rempel belakang yang memukau, rok ini sangat cocok untuk ospek atau acara formal. Dirancang dari bahan semi woll berkualitas, memberikan penampilan mewah sekaligus kenyamanan tanpa kompromi.',
    specifications: `MATRIAL BAHAN/KAIN : "MELENIUM"

√ TEBAL
√ HALUS
√ JATUH&LICIN

UKURAN : S,M,L,XL

WARNA : HITAM,COKLAT,BIRU

MODEL A LINE PINGGANG KARET SAMPING

*KANCING HAG DALAM
*RESLETING DIBAGIAN BELAKANG
*TERDAPAT KANTONG SAKU
*ADA KOLONG BUAT IKAT PINGGANG

KETERANGAN UKURAN :

SIZE S
PANJANG : 91 CM
LINGKAR PINGGANG : 66 CM ( NORMAL ) SETELAH MULUR 80 CM
LINGKAR BAWAH : 122 CM ( MELINGKAR )
PERKIRAAN BB : 40-45 KG

SIZE M
PANJANG : 93 CM
LINGKAR PINGGANG : 68 CM ( NORMAL ) SETELAH MULUR 82 CM
LINGKAR BAWAH : 124 CM ( MELINGKAR )
PERKIRAAN BB : 46-50 KG

SIZE L
PANJANG :94 CM
LINGKAR PINGGANG : 70 CM ( NORMAL ) SETELAH MULUR 98 CM
LINGKAR BAWAH : 125 CM ( MELINGKAR )
PERKIRAAN BB : 51-55 KG

SIZE XL
PANJANG :94 CM
LINGKAR PINGGANG : 72 CM ( NORMAL ) SETELAH MULUR 110 CM
LINGKAR BAWAH : 126 CM ( MELINGKAR )
PERKIRAAN BB : 56-65 KG`,
    variants: [
      { name: 'Ukuran', options: ['S', 'M', 'L', 'XL'] }
    ],
    available: false
  },
  {
    id: '7',
    name: 'Hijab Hitam',
    price: 20000,
    originalPrice: 29000,
    discount: 31,
    image: '/produk5.png',
    category: ['aksesoris', 'perempuan'],
    rating: 5.0,
    sold: 25,
    description: 'Jilbab segiempat Paris Premium berwarna hitam pekat. Bahannya halus, adem, mudah dibentuk, dan tegak paripurna di dahi. Cocok untuk daily hijab maupun acara resmi. Produk tanpa merek, bisa untuk dijual kembali.',
    specifications: `Material: Katun Paris Premium
Ukuran: 110 x 110 cm
Fitur Unggulan:
• Halus, lembut, dan tidak berbulu
• Tidak licin & sangat mudah dibentuk
• Tegak di dahi (tidak letoy)
Catatan: Disarankan dicuci terlebih dahulu sebelum pemakaian pertama.`,
    available: false
  },
  {
    id: '8',
    name: 'Hijab Putih',
    price: 20000,
    originalPrice: 29000,
    discount: 31,
    image: '/produk6.png',
    category: ['aksesoris', 'perempuan'],
    rating: 5.0,
    sold: 21,
    description: 'Jilbab segiempat Paris Premium berwarna putih bersih. Bahannya halus, adem, mudah dibentuk, dan tegak paripurna di dahi. Cocok untuk daily hijab maupun acara resmi. Produk tanpa merek, bisa untuk dijual kembali.',
    specifications: `Material: Katun Paris Premium
Ukuran: 110 x 110 cm
Fitur Unggulan:
• Halus, lembut, dan tidak berbulu
• Tidak licin & sangat mudah dibentuk
• Tegak di dahi (tidak letoy)
Catatan: Disarankan dicuci terlebih dahulu sebelum pemakaian pertama.`,
    available: false
  },
  {
    id: '9',
    name: 'Kaos Kaki Hitam',
    price: 15000,
    originalPrice: 21000,
    discount: 29,
    image: '/produk7.png',
    category: ['aksesoris', 'laki-laki', 'perempuan'],
    rating: 5.0,
    sold: 24,
    description: 'Kaos kaki hitam polos dengan bahan lembut berkualitas tinggi, memberikan kenyamanan maksimal saat dipakai beraktivitas seharian.',
    specifications: `Material:
• 70% Cotton
• 20% Polyester
• 10% Spandex

Cara Perawatan:
• Suhu maksimal 40°C
• Jangan gunakan pemutih
• Jangan dicuci kering atau disetrika`,
    available: false
  },
  {
    id: '10',
    name: 'Kaos Kaki Putih',
    price: 15000,
    originalPrice: 21000,
    discount: 29,
    image: '/produk8.png',
    category: ['aksesoris', 'laki-laki', 'perempuan'],
    rating: 5.0,
    sold: 23,
    description: 'Kaos kaki putih polos dengan bahan lembut berkualitas tinggi, memberikan kenyamanan maksimal saat dipakai beraktivitas seharian.',
    specifications: `Material:
• 70% Cotton
• 20% Polyester
• 10% Spandex

Cara Perawatan:
• Suhu maksimal 40°C
• Jangan gunakan pemutih
• Jangan dicuci kering atau disetrika`,
    available: false
  },
  {
    id: '11',
    name: 'Kaos Putih Panjang',
    price: 50000,
    originalPrice: 71000,
    discount: 30,
    image: '/produk9.png',
    category: ['pakaian', 'laki-laki', 'perempuan'],
    rating: 5.0,
    sold: 18,
    description: 'Kaos polos lengan panjang unisex dengan bahan 100% Cotton Combed 30s reaktif. Tekstur halus, lembut, dan lebih tebal (gramasi 150-160). Cocok untuk segala aktivitas, dari hangout hingga sebagai dalaman kemeja.',
    specifications: `Bahan: 100% Cotton Combed 30s
Fitur:
• Desain Unisex (cocok untuk pria & wanita)
• Jahitan pundak rantai, rib leher tidak mudah melar
• Standar apparel/distro
• Cocok untuk semua jenis sablon

SIZE CHART (Lebar x Panjang, toleransi 1-2cm):
• S: 48 cm x 68 cm
• M: 50 cm x 72 cm
• L: 52 cm x 74 cm
• XL: 54 cm x 77 cm
• XXL: 56 cm x 79 cm`,
    variants: [
      { name: 'Ukuran', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    available: false
  },
  {
    id: '12',
    name: 'Celana Training',
    price: 55000,
    originalPrice: 79000,
    discount: 30,
    image: '/produk10.png',
    category: ['pakaian', 'laki-laki', 'perempuan'],
    rating: 5.0,
    sold: 12,
    description: 'Sweatpants jogger unisex yang super nyaman. Dibuat dari bahan fleece yang menyerap keringat dan tidak menerawang, sangat cocok untuk kegiatan olahraga, santai, atau kepanitiaan di kampus.',
    specifications: `Bahan: Fleece
Fitur: Pinggang karet elastis, saku di kanan dan kiri

SIZE CHART (Panjang x Lebar Pinggang):
• M: Panjang 88cm, Lebar Pinggang 86cm (melar)
• L: Panjang 90cm, Lebar Pinggang 88cm (melar)
• XL: Panjang 92cm, Lebar Pinggang 90cm (melar)`,
    variants: [
      { name: 'Ukuran', options: ['M', 'L', 'XL'] }
    ],
    available: false
  },
  {
    id: '13',
    name: 'Pantofel Pria',
    price: 75000,
    originalPrice: 107000,
    discount: 30,
    image: '/produk11.png',
    category: ['aksesoris', 'laki-laki'],
    rating: 5.0,
    sold: 16,
    description: 'Sepatu pantofel pria 100% original brand lokal. Dibuat dari kulit sintetis berkualitas dengan desain formal klasik yang awet dan nyaman, pilihan tepat untuk ospek dan kegiatan resmi.',
    specifications: `Bahan: Kulit Sintetis
Warna: Hitam

SIZE CHART (Panjang Insole):
• Size 39: 24.5 cm
• Size 40: 25 cm
• Size 41: 25.5 cm
• Size 42: 26 cm
• Size 43: 26.5 cm`,
    variants: [
      { name: 'Ukuran', options: ['39', '40', '41', '42', '43'] }
    ],
    available: false
  },
  {
    id: '14',
    name: 'Pantofel Wanita',
    price: 65000,
    originalPrice: 93000,
    discount: 30,
    image: '/produk12.png',
    category: ['aksesoris', 'perempuan'],
    rating: 5.0,
    sold: 20,
    description: 'Sepatu pantofel wanita yang elegan dan serbaguna, cocok untuk semua aktivitas Anda, mulai dari dinas, sekolah, kuliah, hingga acara formal. Dibuat dengan bahan sintetis terbaik yang tidak mudah sobek dan sol anti-licin yang lentur.',
    specifications: `Bahan: Kulit Sintetis Terbaik (tidak mudah pecah/sobek)
Sol: Karet lentur, anti-licin
Tinggi Hak: 3 cm
Warna: Hitam

PANDUAN UKURAN (Panjang Telapak Kaki):
• Size 37: 23 cm
• Size 38: 23.5 cm
• Size 39: 24 cm
• Size 40: 25 cm
• Size 41: 26 cm`,
    variants: [
      { name: 'Ukuran', options: ['37', '38', '39', '40', '41'] }
    ],
    available: false
  },
  {
    id: '15',
    name: 'Ikat Pinggang',
    price: 25000,
    originalPrice: 36000,
    discount: 31,
    image: '/produk13.png',
    category: ['aksesoris', 'laki-laki', 'perempuan'],
    rating: 5.0,
    sold: 25,
    description: 'Ikat pinggang kulit fiber berkualitas tinggi. Dijamin kuat, anti robek, dan fashionable untuk melengkapi gaya formal Anda. Wajib untuk kelengkapan ospek dan seragam.',
    specifications: `Material: Kulit Fiber High Quality
Lebar: 3.5 cm
Warna Tali: Hitam
Warna Kepala: Emas / Perak (Motif random)`,
    available: false
  },
  {
    id: '16',
    name: 'Hasduk & Rotan',
    price: 22000,
    originalPrice: 31000,
    discount: 29,
    image: '/produk14.png',
    category: ['aksesoris', 'laki-laki', 'perempuan'],
    rating: 5.0,
    sold: 14,
    description: 'Satu set hasduk pramuka lengkap dengan ring rotan berkualitas. Kain super halus (ero/tetron) dengan jahitan rapi dan warna yang tidak mudah luntur. Ring rotan asli, awet, dan halus.',
    specifications: `Bahan Hasduk: Kain Super Halus (Ero/Tetron)
Ring: Rotan Asli Kualitas Bagus
Fitur: Jahitan rapi, warna awet, toleransi ukuran hasduk -+5cm`,
    available: false
  },
  {
    id: '17',
    name: 'Pin Garuda',
    price: 7000,
    originalPrice: 10000,
    discount: 30,
    image: '/produk15.png',
    category: ['aksesoris', 'laki-laki', 'perempuan'],
    rating: 5.0,
    sold: 22,
    description: 'Tunjukkan semangat nasionalisme dengan pin Garuda berkualitas tinggi. Dibuat menggunakan mesin laser untuk hasil yang presisi dan detail tajam. Pengait peniti yang kuat.',
    specifications: `Bahan: Akrilik 2mm
Ukuran: Bervariasi (tergantung motif)
Cetak: Full Color
Fitur: Hasil presisi dengan potongan laser`,
    available: false
  },
  {
    id: '18',
    name: 'Pin Bendera',
    price: 7000,
    originalPrice: 10000,
    discount: 30,
    image: '/produk16.png',
    category: ['aksesoris', 'laki-laki', 'perempuan'],
    rating: 5.0,
    sold: 20,
    description: 'Pin bendera Merah Putih dengan kualitas terbaik. Warna cerah dan tidak mudah luntur. Dibuat menggunakan mesin laser untuk hasil yang presisi. Pengait peniti yang kuat.',
    specifications: `Bahan: Akrilik 2mm
Ukuran: Bervariasi (tergantung motif)
Cetak: Full Color
Fitur: Hasil presisi dengan potongan laser`,
    available: false
  },
  {
    id: '19',
    name: 'Cincin Rotan Pramuka',
    price: 7500,
    originalPrice: 10700,
    discount: 30,
    image: '/produk19.png',
    category: ['aksesoris', 'laki-laki', 'perempuan'],
    rating: 5.0,
    sold: 30,
    description: 'Cincin Rotan untuk Hasduk Pramuka. Dibuat dari rotan asli berkualitas, halus, dan awet. Pelengkap wajib untuk seragam pramuka saat kegiatan ospek atau acara kepramukaan lainnya.',
    specifications: `Bahan: Rotan Asli Pilihan
Ukuran: Standar Hasduk Pramuka
Fitur: Halus, kuat, dan tidak mudah patah.`,
    available: false
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