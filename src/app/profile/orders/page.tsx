'use client';

import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { SectionHeader } from '@/components/layout/SectionHeader';

export default function OrdersPage() {
  return (
    <div className="max-w-4xl">
      <SectionHeader 
        title1="ORDER" 
        title2="HISTORY" 
        subtitle="PURCHASE TRACKING"
        className="mb-12"
      />

      <div className="p-12 rounded-3xl bg-gray-50/50 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-6">
          <ShoppingBag size={24} className="text-[#8C5E45]" />
        </div>
        <p className="text-lg font-medium text-gray-900 mb-2">No orders yet</p>
        <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">
          You haven't placed any orders yet. When you do, they will appear here.
        </p>
        <Link 
          href="/all"
          className="px-8 py-3 bg-black text-white hover:bg-gray-800 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase transition-all shadow-xl shadow-black/5"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );
}
