'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/use-cart-store';
import { useWishlistStore } from '@/store/use-wishlist-store';
import { useUIStore } from '@/store/use-ui-store';

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
  sizes?: string[];
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
  
  const { activeSizeSelectionId, setActiveSizeSelectionId } = useUIStore();
  const isSelectingSize = activeSizeSelectionId === product.id;
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const productSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['ONESIZE'];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveSizeSelectionId(product.id);
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
    
    setActiveSizeSelectionId(null);
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

        {/* Mobile Action Overlays */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 md:hidden opacity-90">
          <button
            onClick={toggleWishlist}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-full shadow-lg border backdrop-blur-md transition-all active:scale-95",
              mounted && isWishlisted ? "bg-red-50 text-red-500 border-red-100" : "bg-white/80 text-gray-500 border-white/20"
            )}
          >
            <Heart size={14} fill={mounted && isWishlisted ? "currentColor" : "none"} />
          </button>
          <button
            onClick={handleAddToCart}
            className="w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/20 text-gray-500 active:scale-95 transition-all"
          >
            <ShoppingBag size={14} />
          </button>
        </div>

        {/* Desktop Hover Overlay (Optional but nice) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors pointer-events-none hidden md:block" />
        
        {/* Size Selection Overlay */}
        {isSelectingSize && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white animate-in fade-in duration-300 z-20">
            <button 
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                setActiveSizeSelectionId(null); 
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X size={20} />
            </button>
            <p className="text-[10px] font-black tracking-[0.2em] mb-6 uppercase">SELECT SIZE</p>
            <div className="flex flex-wrap justify-center gap-2">
              {productSizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => confirmSize(size, e)}
                  className={cn(
                    "h-10 border border-white/30 rounded-full flex items-center justify-center text-[10px] font-bold hover:bg-white hover:text-black hover:border-white transition-all",
                    size === 'ONESIZE' ? "px-6" : "w-10"
                  )}
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
          
          <div className="hidden md:flex items-center gap-1.5 pt-0.5">
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
