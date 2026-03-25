'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWishlistStore } from '@/store/use-wishlist-store';
import { ProductCard } from '@/components/product/ProductCard';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <main className="min-h-screen bg-white pt-20">
      <Navbar />
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-pulse text-[10px] font-black tracking-widest text-gray-300 uppercase">Loading Wishlist...</div>
      </div>
      <Footer />
    </main>
  );

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white pt-20">
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000">
          <div className="w-20 h-20 bg-gray-50 flex items-center justify-center mb-8">
            <Heart className="text-gray-300" size={32} />
          </div>
          <SectionHeader title1="YOUR WISHLIST" title2="IS EMPTY" />
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-10 max-w-xs leading-relaxed">
            You haven't saved any items yet. Start exploring our collections to find your favorites.
          </p>
          <Link 
            href="/" 
            className="bg-[#2D2D2D] text-white px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/5"
          >
            Explore Collections
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-20">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24 animate-in fade-in duration-700">
        <div className="mb-16">
          <SectionHeader 
            title1="YOUR" 
            title2="WISHLIST" 
            subtitle={`YOU HAVE ${items.length} SAVED ${items.length === 1 ? 'ITEM' : 'ITEMS'}`} 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {items.map((product) => (
            <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ProductCard product={product} />
              <button 
                onClick={() => useWishlistStore.getState().toggleItem(product)}
                className="mt-6 w-full py-4 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2 group"
              >
                <Heart size={12} fill="currentColor" className="text-red-500" />
                <span>Remove from Favorites</span>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col items-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Continue Shopping</span>
            </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
