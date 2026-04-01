'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/use-cart-store';
import { useWishlistStore } from '@/store/use-wishlist-store';

export interface Product {
  id: string;
  name: string;
  price: number;
  offer_price?: number;
  images: string[];
  is_featured?: boolean;
  is_sale?: boolean;
  gender?: string;
  category?: { name: string };
  categories?: { name: string };
}

interface ProductCardProps {
  product: Product;
  badge?: string;
  variant?: 'default' | 'rounded';
}

export const ProductCard = ({ product, badge, variant = 'default' }: ProductCardProps) => {
  const [mounted, setMounted] = useState(false);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);
  const [isSelectingSize, setIsSelectingSize] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSelectingSize(true);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  const confirmSize = (size: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
    
    // Add to global cart state
    useCartStore.getState().addItem(product, size);
    
    setIsSelectingSize(false);
  };

  return (
    <div className="group block h-full">
      <div className={cn(
        "relative aspect-[3/4] overflow-hidden bg-[#F8F9FA] mb-4 transition-all duration-700",
        variant === 'rounded' ? "rounded-3xl" : "rounded-sm"
      )}>
        <Link href={`/product/${product.id}`} className="block h-full w-full">
          <Image
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop'}
            alt={product.name}
            fill
            className="object-cover mix-blend-multiply hover:mix-blend-normal transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </Link>

        {/* Badges */}
        {badge && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-[#2D2D2D] text-white text-[9px] font-black uppercase tracking-widest shadow-sm z-10">
            {badge}
          </div>
        )}
        {(product.is_sale || (product.offer_price && product.offer_price < product.price)) && !badge && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-[#D97706] text-white text-[9px] font-black uppercase tracking-widest shadow-sm z-10">
            SALE
          </div>
        )}

        {/* Size Selection Overlay (Still on Image for Focus) */}
        {isSelectingSize && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white animate-in fade-in duration-300 z-20">
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsSelectingSize(false); }}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X size={20} />
            </button>
            <p className="text-[10px] font-black tracking-[0.2em] mb-6 uppercase">SELECT SIZE</p>
            <div className="flex flex-wrap justify-center gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => confirmSize(size, e)}
                  className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center text-[10px] font-bold hover:bg-white hover:text-black hover:border-white transition-all"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-1 mt-3">
        <div className="flex justify-between items-start gap-4">
          <Link href={`/product/${product.id}`} className="flex-1 block">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">
              {(product.category?.name || product.categories?.name || product.gender || 'ESSENTIALS')}
            </p>
            <h3 className="text-[11px] font-black tracking-[0.05em] mb-1.5 uppercase text-[#2D2D2D] line-clamp-1 group-hover:text-[#D97706] transition-colors leading-tight">
              {product.name}
            </h3>
            <div className="flex items-center gap-2.5">
              <p className={cn(
                "text-[11px] font-bold",
                product.offer_price ? "text-gray-400 line-through" : "text-[#2D2D2D]"
              )}>
                ₹{Number(product.price).toFixed(2)}
              </p>
              {product.offer_price && (
                <p className="text-[11px] font-bold text-[#D97706]">
                  ₹{Number(product.offer_price).toFixed(2)}
                </p>
              )}
            </div>
          </Link>
          
          <div className="flex items-center gap-1.5 pt-0.5">
            <button
              onClick={toggleWishlist}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full border border-gray-100 shadow-sm transition-all hover:scale-110",
                mounted && isWishlisted ? "bg-red-50 text-red-500 border-red-100" : "bg-white text-gray-400 hover:text-black"
              )}
            >
              <Heart size={14} fill={mounted && isWishlisted ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleAddToCart}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-full border border-gray-100 shadow-sm text-gray-400 hover:text-[#D97706] transition-all hover:scale-110"
            >
              <ShoppingBag size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
