'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/contexts/CartContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem(product);
    toast({
      title: 'Berhasil!',
      description: 'Produk berhasil ditambahkan ke keranjang'
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
      toast({
        description: 'Produk dihapus dari wishlist',
      });
    } else {
      addToWishlist(product);
      toast({
        description: 'Produk ditambahkan ke wishlist',
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <Link href={`/produk/${product.id}`}>
      <div className={cn(
        "bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300",
        "transform hover:-translate-y-1",
        "border border-gray-100",
        "group relative",
        "animate-fade-in"
      )}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-t-xl">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={cn(
              "object-cover",
              "transform transition-transform duration-500",
              "group-hover:scale-110"
            )}
          />
          
          {/* Discount Badge */}
          {product.originalPrice && (
            <div className={cn(
              "absolute top-2 left-2",
              "bg-gradient-to-r from-red-500 to-rose-600",
              "text-white",
              "px-3 py-1.5 rounded-full",
              "text-xs font-semibold",
              "shadow-lg",
              "transform transition-all duration-300",
              "hover:scale-105 hover:shadow-xl",
              "backdrop-blur-sm bg-opacity-90"
            )}>
              -{calculateDiscount(product.originalPrice, product.price)}%
            </div>
          )}

          {/* Action Buttons Container */}
          <div className={cn(
            "absolute bottom-2 right-2",
            "flex flex-col gap-2",
            "opacity-0 group-hover:opacity-100",
            "transition-all duration-300",
            "transform translate-x-2 group-hover:translate-x-0"
          )}>
            {/* Add to Cart Button */}
            <Button
              size="sm"
              onClick={handleAddToCart}
              className={cn(
                "bg-blue-600 hover:bg-blue-700",
                "text-white rounded-full",
                "w-10 h-10 p-0",
                "shadow-lg hover:shadow-xl",
                "transform hover:scale-110",
                "transition-all duration-300"
              )}
              title="Tambah ke Keranjang"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>

            {/* Wishlist Button */}
            <Button
              size="sm"
              onClick={handleWishlistToggle}
              variant="secondary"
              className={cn(
                "rounded-full w-10 h-10 p-0",
                "shadow-lg hover:shadow-xl",
                "transform hover:scale-110",
                "transition-all duration-300",
                isWishlisted(product.id) ? "bg-red-50 text-red-500" : "bg-white text-gray-600"
              )}
              title={isWishlisted(product.id) ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}
            >
              <Heart 
                className="h-4 w-4" 
                fill={isWishlisted(product.id) ? "currentColor" : "none"} 
              />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className={cn(
            "font-medium text-sm text-gray-900",
            "mb-2 line-clamp-2 h-10",
            "group-hover:text-blue-600",
            "transition-colors duration-300"
          )}>
            {product.name}
          </h3>

          {/* Rating and Sold */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              {renderStars(product.rating)}
              <span className="text-xs text-gray-500 ml-1">
                ({product.rating})
              </span>
            </div>
            <span className="text-xs text-gray-500">
              Terjual {product.sold}+
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Mobile Action Buttons */}
          <div className={cn(
            "mt-3 grid grid-cols-2 gap-2",
            "sm:hidden" // Hanya tampil di mobile
          )}>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Beli
            </Button>
            <Button
              size="sm"
              onClick={handleWishlistToggle}
              variant="outline"
              className={cn(
                "w-full",
                isWishlisted(product.id) ? "text-red-500 border-red-500" : ""
              )}
            >
              <Heart 
                className="h-4 w-4 mr-2" 
                fill={isWishlisted(product.id) ? "currentColor" : "none"} 
              />
              {isWishlisted(product.id) ? "Tersimpan" : "Simpan"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;