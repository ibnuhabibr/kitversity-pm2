'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, Grid, List, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import ProductCard from '@/components/ProductCard';
import { products, categories, searchProducts } from '@/data/products';
import { type Product } from '@/contexts/CartContext';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// --- Komponen Skeleton untuk Loading ---
const ProductCardSkeleton = () => (
    <div className="space-y-3">
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
        </div>
    </div>
);


// --- Komponen Utama yang Mengandung Logika Client ---
function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Efek untuk menandai komponen sudah di sisi client dan inisialisasi state dari URL
  useEffect(() => {
    setIsClient(true);
    const categoryQuery = searchParams.get('category');
    if (categoryQuery) {
      setSelectedCategories(prev => Array.from(new Set([...prev, categoryQuery])));
    }
    const searchQueryParam = searchParams.get('search');
    if(searchQueryParam){
      setSearchQuery(searchQueryParam);
    }
  }, [searchParams]);

  // Memoize hasil filter untuk performa
  const productsResult = useMemo(() => {
    let result = [...products];

    // Filter berdasarkan query pencarian dari state
    if (searchQuery) {
      result = searchProducts(searchQuery);
    }

    // Filter berdasarkan kategori
    if (selectedCategories.length > 0) {
      result = result.filter(product => 
        product.category.some(c => selectedCategories.includes(c))
      );
    }

    // Filter berdasarkan rentang harga
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sorting - Available products first, then unavailable
    const sortedResult = [...result];
    switch (sortBy) {
      case 'price-low':
        sortedResult.sort((a, b) => {
          // Available products first
          if (a.available !== b.available) {
            return (a.available === true ? -1 : 1);
          }
          return a.price - b.price;
        });
        break;
      case 'price-high':
        sortedResult.sort((a, b) => {
          // Available products first
          if (a.available !== b.available) {
            return (a.available === true ? -1 : 1);
          }
          return b.price - a.price;
        });
        break;
      case 'popular':
        sortedResult.sort((a, b) => {
          // Available products first
          if (a.available !== b.available) {
            return (a.available === true ? -1 : 1);
          }
          return (b.sold || 0) - (a.sold || 0);
        });
        break;
      case 'rating':
        sortedResult.sort((a, b) => {
          // Available products first
          if (a.available !== b.available) {
            return (a.available === true ? -1 : 1);
          }
          return (b.rating || 0) - (a.rating || 0);
        });
        break;
      default: // 'relevance' - Available products first
        sortedResult.sort((a, b) => {
          if (a.available !== b.available) {
            return (a.available === true ? -1 : 1);
          }
          return 0;
        });
        break;
    }

    return sortedResult;
  }, [searchQuery, selectedCategories, priceRange, sortBy]);

  useEffect(() => {
    setFilteredProducts(productsResult);
  }, [productsResult]);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      router.push(`/produk?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleCategoryChange = (categoryId: string, checked: boolean | 'indeterminate') => {
    const newCategories = checked
        ? [...selectedCategories, categoryId]
        : selectedCategories.filter(id => id !== categoryId);
    setSelectedCategories(newCategories);

    // Update URL agar state konsisten (opsional tapi bagus)
    const params = new URLSearchParams(window.location.search);
    if(newCategories.length > 0) {
        params.set('category', newCategories.join(','));
    } else {
        params.delete('category');
    }
    router.push(`/produk?${params.toString()}`);
  };
  
  const resetFilters = () => {
      setSelectedCategories([]);
      setPriceRange([0, 1000000]);
      setSortBy('relevance');
      setSearchQuery('');
      router.push('/produk');
  };

  if (!isClient) {
      // Tampilkan skeleton saat server-side rendering
      return (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Semua Produk</h1>
          <p className="text-lg text-gray-600">Temukan semua kebutuhan kuliahmu di sini.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:hidden mb-4">
              <Button onClick={() => setIsFilterOpen(!isFilterOpen)} className="w-full justify-between" variant="outline">
                <span><Filter className="h-4 w-4 mr-2 inline" />Filter Produk</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", isFilterOpen && "rotate-180")} />
              </Button>
            </div>

            <div className={cn("bg-white rounded-lg p-6 space-y-8 transition-all duration-300", isFilterOpen ? 'block' : 'hidden lg:block')}>
              <form onSubmit={handleSearchSubmit} className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Cari Produk</h3>
                  <Input type="text" placeholder="Nama produk..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </form>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Kategori</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(checked) => handleCategoryChange(category.id, checked)}
                      />
                      <label htmlFor={category.id} className="text-sm text-gray-700 cursor-pointer flex-grow">{category.name}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Rentang Harga</h3>
                <div className="space-y-2">
                  <Input type="number" placeholder="Rp Minimum" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} />
                  <Input type="number" placeholder="Rp Maksimum" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} />
                </div>
              </div>

              <Button variant="ghost" className="w-full text-red-600 hover:text-red-700" onClick={resetFilters}>
                <X className="h-4 w-4 mr-2"/> Reset Filter
              </Button>
            </div>
          </aside>

          {/* Products Section */}
          <main className="flex-1">
            <div className="bg-white rounded-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 border">
              <p className="text-gray-600 text-sm">Menampilkan {filteredProducts.length} produk</p>
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Paling Relevan</SelectItem>
                    <SelectItem value="popular">Paling Laris</SelectItem>
                    <SelectItem value="price-low">Harga Terendah</SelectItem>
                    <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                    <SelectItem value="rating">Rating Tertinggi</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="icon" variant={viewMode === 'grid' ? 'default' : 'outline'} onClick={() => setViewMode('grid')}><Grid className="h-4 w-4" /></Button>
                <Button size="icon" variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')}><List className="h-4 w-4" /></Button>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className={cn("grid gap-6", viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1')}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🧐</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Produk Tidak Ditemukan</h3>
                <p className="text-gray-600 mb-6">Coba ganti filter atau kata kunci pencarian Anda.</p>
                <Button onClick={resetFilters}>Reset Filter</Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// --- Wrapper Komponen untuk Suspense ---
export default function ProductsPage() {
  return (
    <Suspense fallback={
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
        </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
