'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { WelcomePopup } from '@/components/WelcomePopup';
import { products, categories } from '@/data/products';

const heroSlides = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg',
    title: 'PAKET LENGKAP OSPEK',
    subtitle: 'DISKON 20%!',
    description: 'Dapatkan semua kebutuhan OSPEK dengan harga spesial'
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
    title: 'TAS KULIAH PREMIUM',
    subtitle: 'ANTI AIR & STYLISH',
    description: 'Tas berkualitas tinggi untuk mahasiswa aktif'
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
    title: 'BUKU & MODUL KULIAH',
    subtitle: 'LENGKAP & TERPERCAYA',
    description: 'Koleksi buku dan modul untuk semua jurusan'
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const featuredProducts = products.slice(0, 8);

  const scrollToCategories = () => {
    const categoriesSection = document.getElementById('categories-section');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <WelcomePopup />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="relative h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-2xl px-4">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl font-semibold text-orange-400 mb-4">
                    {slide.subtitle}
                  </p>
                  <p className="text-lg mb-8 opacity-90">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
                      <Link href="/produk">Beli Sekarang</Link>
                    </Button>
                    <Button 
                      onClick={scrollToCategories}
                      variant="outline" 
                      size="lg" 
                      className="text-white border-white hover:bg-white hover:text-gray-900 bg-transparent"
                    >
                      Lihat Kategori
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section id="categories-section" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Telusuri Kategori
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Temukan semua kebutuhan kuliah Anda dalam berbagai kategori
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/produk?category=${category.id}`}
                className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-medium text-gray-900 text-sm">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Paling Laris Minggu Ini
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Produk pilihan yang paling diminati mahasiswa
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/produk">Lihat Semua Produk</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Gratis Ongkir untuk Pembelian di area Surabaya dan Kampus UNAIR
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Tanpa minimal pembelian
            </p>
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
              <Link href="/produk">Belanja Sekarang</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    {/* Layout diubah jadi grid-cols-4 untuk desktop */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Keunggulan 1 */}
      <div className="text-center">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">💸</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Harga Termurah
        </h3>
        <p className="text-gray-600">
          Kami jamin harga paling kompetitif untuk kantong mahasiswa.
        </p>
      </div>

      {/* Keunggulan 2 */}
      <div className="text-center">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🚚</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Gratis Ongkos Kirim
        </h3>
        <p className="text-gray-600">
          Area Surabaya & Kampus UNAIR. Pengiriman cepat dan aman.
        </p>
      </div>

      {/* Keunggulan 3 */}
      <div className="text-center">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">💬</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Customer Service 24/7
        </h3>
        <p className="text-gray-600">
          Tim support siap membantu Anda kapan saja via WhatsApp.
        </p>
      </div>

      {/* Keunggulan 4 */}
      <div className="text-center">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Produk Berkualitas
        </h3>
        <p className="text-gray-600">
          Semua produk telah melalui quality control untuk kepuasan Anda.
        </p>
      </div>
    </div>
  </div>
</section>
    </div>
  );
}