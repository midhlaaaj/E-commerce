'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWishlistStore } from '@/store/use-wishlist-store';
import CollectionClient from '@/components/collection/CollectionClient';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-pulse text-[10px] font-black tracking-widest text-gray-300 uppercase">Loading Wishlist...</div>
      </div>
      <Footer />
    </main>
  );

  // If items is empty, we still use CollectionClient but it will show its empty state
  // Or we can keep the custom empty state which looks nicer for a wishlist
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000">
          <div className="w-20 h-20 bg-gray-50 flex items-center justify-center mb-8">
            <Heart className="text-gray-300" size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl tracking-tighter uppercase leading-none text-[#1A1614] mb-4">
            <span className="font-light">YOUR WISHLIST</span> <span className="font-extrabold">IS EMPTY</span>
          </h1>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-10 max-w-xs leading-relaxed">
            You haven't saved any items yet. Start exploring our collections to find your favorites.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-[#1A1614] text-white px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/5"
          >
            Explore Collections
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <CollectionClient 
        initialProducts={items as any} 
        title1="YOUR"
        title2="WISHLIST"
        subtitle={`YOU HAVE ${items.length} SAVED ${items.length === 1 ? 'STYLE' : 'STYLES'}`}
        backLabel="CONTINUE SHOPPING"
        isBackDynamic={true}
        hideFilters={true}
        hideSort={true}
      />
      <Footer />
    </main>
  );
}
