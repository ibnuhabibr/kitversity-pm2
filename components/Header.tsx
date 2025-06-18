'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, Search, Heart, ChevronDown } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const pathname = usePathname();
  const { getTotalItems } = useCart();
  const { state: wishlistState } = useWishlist();

  const totalWishlistItems = wishlistState.items.length;

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Produk', href: '/produk' },
    { name: 'Chatbot AI', href: '/chat' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Kontak', href: '/kontak' }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/produk?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-white"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-32 h-8">
              <Image
                src="/kitversity-simply-logo.png"
                alt="Kitversity Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-all duration-300",
                  "hover:text-blue-600 relative group",
                  pathname === item.href
                    ? "text-blue-600"
                    : "text-gray-700"
                )}
              >
                {item.name}
                <span 
                  className={cn(
                    "absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 transition-transform duration-300",
                    pathname === item.href ? "scale-x-100" : "group-hover:scale-x-100"
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center space-x-2 flex-1 max-w-md mx-8">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 transition-colors group-focus-within:text-blue-600" />
              <Input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "pl-10 transition-all duration-300",
                  "border-gray-200 focus:border-blue-600",
                  "hover:border-gray-300",
                  "focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                )}
              />
            </div>
            <Button 
              type="submit" 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            >
              Cari
            </Button>
          </form>

          {/* Cart, Wishlist, and Mobile Menu */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative group">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "relative transition-transform duration-300",
                  "hover:scale-110"
                )}
              >
                <Heart className="h-5 w-5 transition-colors group-hover:text-red-500" />
                {totalWishlistItems > 0 && (
                  <span className={cn(
                    "absolute -top-2 -right-2 bg-red-500 text-white",
                    "text-xs rounded-full h-5 w-5",
                    "flex items-center justify-center",
                    "animate-in zoom-in-50 duration-300"
                  )}>
                    {totalWishlistItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/keranjang" className="relative group">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "relative transition-transform duration-300",
                  "hover:scale-110"
                )}
              >
                <ShoppingCart className="h-5 w-5 transition-colors group-hover:text-blue-600" />
                {getTotalItems() > 0 && (
                  <span className={cn(
                    "absolute -top-2 -right-2 bg-blue-600 text-white",
                    "text-xs rounded-full h-5 w-5",
                    "flex items-center justify-center",
                    "animate-in zoom-in-50 duration-300"
                  )}>
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="h-5 w-5 transition-transform duration-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className={cn(
          "lg:hidden overflow-hidden transition-all duration-300",
          isMobileSearchOpen ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
        )}>
          <form onSubmit={handleSearch} className="py-4 border-t">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 transition-colors group-focus-within:text-blue-600" />
                <Input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "pl-10 transition-all duration-300",
                    "border-gray-200 focus:border-blue-600",
                    "hover:border-gray-300"
                  )}
                />
              </div>
              <Button 
                type="submit" 
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
              >
                Cari
              </Button>
            </div>
          </form>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="py-4 border-t">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-all duration-300",
                    "flex items-center justify-between",
                    "px-4 py-2 rounded-lg",
                    pathname === item.href 
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.name}</span>
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      pathname === item.href ? "rotate-180" : ""
                    )}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;