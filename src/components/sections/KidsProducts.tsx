'use client';

import { useState } from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ProductCard } from '@/components/product/ProductCard';

interface KidsProductsProps {
  initialData?: any[];
}

export const KidsProducts = ({ initialData = [] }: KidsProductsProps) => {
  const [products] = useState(initialData);

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-gray-50">
      <SectionHeader 
        title1="KIDS'" 
        title2="SELECTION" 
        subtitle="GROWING WITH STYLE. MADE FOR PLAY." 
        className="mb-12"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mb-16">
        {products.length > 0 ? products.map((product) => (
          <ProductCard key={product.id} product={product} />
        )) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
              <ShoppingBag size={32} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">The Kids' Collection is currently being curated.</p>
            <p className="text-xs font-medium text-gray-300 max-w-xs mx-auto italic">Style starts early. Coming soon.</p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Link 
          href="/kids/collection" 
          className="group flex items-center gap-4 text-[10px] font-extrabold tracking-[0.3em] uppercase transition-all"
        >
          <span className="border-b-2 border-black pb-1 group-hover:text-gray-500 group-hover:border-gray-300">
            EXPLORE ALL KIDS' PIECES
          </span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
        </Link>
      </div>
    </section>
  );
};
