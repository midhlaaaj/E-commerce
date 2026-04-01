'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWishlistStore } from '@/store/use-wishlist-store';

export const ProductGallery = ({ images = [], product }: { images?: string[], product?: any }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { toggleItem, isInWishlist } = useWishlistStore();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const mainImage = images[selectedIndex] || 'https://images.unsplash.com/photo-1581001479836-eeb2956cf2eb?q=80&w=1964&auto=format&fit=crop';

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product) toggleItem(product);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6 w-full items-start max-w-2xl mx-auto lg:mx-0">
      {/* Vertical Thumbnails */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-3 w-full lg:w-16 overflow-x-auto lg:overflow-y-auto no-scrollbar py-1">
          {images.map((img, idx) => (
            <button 
              key={idx} 
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "relative w-14 h-18 lg:w-full lg:h-20 flex-shrink-0 bg-[#F8F9FA] transition-all duration-300",
                selectedIndex === idx ? "ring-1 ring-black p-1" : "opacity-60 hover:opacity-100"
              )}
            >
               <Image 
                src={img} 
                alt={`Product thumbnail ${idx + 1}`} 
                fill 
                className="object-cover mix-blend-multiply" 
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Main Display */}
      <div className="flex-1 w-full relative aspect-[4/5] bg-[#F8F9FA] overflow-hidden group">
        <Image 
          src={mainImage} 
          alt="Product Main Display" 
          fill
          priority
          className="object-cover mix-blend-multiply transition-transform duration-1000 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className={cn(
            "absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 z-10",
            mounted && isWishlisted ? "bg-red-50 text-red-500" : "bg-white text-gray-400 hover:text-black"
          )}
        >
          <Heart size={18} fill={mounted && isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Badges could go here if needed */}
      </div>
    </div>
  );
};
