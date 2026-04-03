'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRealtime } from '@/hooks/useRealtime';
import { Loader2 } from 'lucide-react';

export const TrendingNow = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTrending() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .limit(5);
    
    if (data) {
      setProducts(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchTrending();
  }, []);

  // Real-Time Sync: Refetch trending if any product changes
  useRealtime('products', () => {
    fetchTrending();
  });

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#D97706]" size={32} />
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Loading Trending Pieces...</span>
    </div>
  );

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto text-center">
      <h2 className="text-3xl font-heading font-bold tracking-tight mb-4 uppercase italic">TRENDING NOW</h2>
      <div className="w-16 h-[2px] bg-[#D97706] mx-auto mb-6" />
      <p className="text-sm text-gray-400 mb-16 max-w-2xl mx-auto font-medium uppercase tracking-widest">
        Curated this week's most loved pieces for the modern minimalist lifestyle.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-left">
        {products.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-50 mb-6 relative shadow-sm group-hover:shadow-xl transition-all duration-500">
              {product.is_featured && (
                <span className="absolute top-4 left-4 z-10 bg-black text-white text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  FEATURED
                </span>
              )}
              {product.is_sale && (
                <span className="absolute top-4 right-4 z-10 bg-[#D97706] text-white text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  SALE
                </span>
              )}
              <img 
                src={product.images?.[0]} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
            </div>
            <h3 className="text-xs font-bold tracking-[0.2em] mb-2 uppercase group-hover:text-[#D97706] transition-colors">{product.name}</h3>
            <div className="flex items-center gap-3">
               <p className="text-sm font-bold text-gray-900 font-heading tracking-tighter">₹{product.price}</p>
               {product.offer_price && (
                 <p className="text-xs font-bold text-gray-400 line-through tracking-tighter">₹{product.offer_price}</p>
               )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
