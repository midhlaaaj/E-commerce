'use client';

import { useState } from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ProductCard } from '@/components/product/ProductCard';

interface MenProductsProps {
  initialData?: any[];
}

export const MenProducts = ({ initialData = [] }: MenProductsProps) => {
  const [products] = useState(initialData);

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 space-y-12 shrink-0">
        <div>
          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6 text-gray-400">FILTER BY SIZE</h3>
          <div className="flex flex-wrap gap-2">
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <button key={size} className={`w-10 h-10 border text-[10px] font-bold flex items-center justify-center rounded-sm transition-all hover:bg-black hover:text-white border-gray-200 text-gray-400`}>
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
           <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6 text-gray-400">FILTER BY COLOR</h3>
           <div className="flex flex-wrap gap-3">
              {['#000000', '#D97706', '#94A3B8', '#F1F5F9', '#1E293B'].map((color, i) => (
                <button 
                  key={i} 
                  className={`w-6 h-6 rounded-full border border-gray-100 transition-transform hover:scale-110 active:scale-95`}
                  style={{ backgroundColor: color }}
                />
              ))}
           </div>
        </div>

        <div className="pt-8 border-t border-gray-100">
           <p className="text-[10px] text-gray-400 font-medium leading-relaxed uppercase tracking-wider">
             Our seasonal collection focuses on durable materials and timeless designs. Each piece is crafted with care for the modern minimalist.
           </p>
        </div>
      </aside>

      {/* Product Grid Area */}
      <div className="flex-1">
        <SectionHeader 
          title1="MEN'S" 
          title2="SELECTION" 
          subtitle="DURABLE MATERIALS & TIMELESS DESIGNS" 
          className="mb-8"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {products.length > 0 ? products.map((product) => (
            <ProductCard key={product.id} product={product} />
          )) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <ShoppingBag size={32} />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">The Men's Collection is currently being curated.</p>
              <p className="text-xs font-medium text-gray-300 max-w-xs mx-auto italic">Check back soon for exclusive arrivals.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
