'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/use-cart-store';
import { CartItem } from '@/components/cart/CartItem';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { SectionHeader } from '@/components/layout/SectionHeader';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RecentlyVisited } from '@/components/sections/RecentlyVisited';

export default function CartPage() {
  const { items, totalItems } = useCartStore();
  const [isLoaded, setIsLoaded] = useState(false);

  // Fix hydration issues with zustand persist
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return (
    <main className="min-h-screen bg-white pt-20">
      <Navbar />
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-pulse text-[10px] font-black tracking-widest text-gray-300 uppercase">Loading Bag...</div>
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
            <ShoppingBag className="text-gray-300" size={32} />
          </div>
          <SectionHeader title1="YOUR BAG" title2="IS EMPTY" />
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-10 max-w-xs leading-relaxed">
            Looks like you haven't added anything to your bag yet.
          </p>
          <Link 
            href="/" 
            className="bg-[#2D2D2D] text-white px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/5"
          >
            Start Shopping
          </Link>
        </div>
        <RecentlyVisited />
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-20">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="mb-12">
          <SectionHeader title1="SHOPPING" title2="BAG" subtitle={`YOU HAVE ${totalItems()} ITEMS IN YOUR SELECTION`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Items */}
          <div className="lg:col-span-8">
            <div className="space-y-2 border-t border-gray-100">
              {items.map((item) => (
                <CartItem key={`${item.id}-${item.size}`} item={item} />
              ))}
            </div>

            <Link 
              href="/" 
              className="inline-flex items-center gap-2 mt-10 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Continue Shopping</span>
            </Link>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <OrderSummary />
          </div>
        </div>
      </div>
      
      <RecentlyVisited />
      <Footer />
    </main>
  );
}
