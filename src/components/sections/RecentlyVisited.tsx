'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { supabase } from '@/lib/supabase';
import { useRealtime } from '@/hooks/useRealtime';
import { ProductCard, type Product } from '@/components/product/ProductCard';

export const RecentlyVisited = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasHistory, setHasHistory] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const loadHistory = async () => {
    if (typeof window === 'undefined') return;

    try {
      const historyJson = localStorage.getItem('recently-visited');
      let history: string[] = historyJson ? JSON.parse(historyJson) : [];

      // Filter for basic validity (non-empty strings)
      const validHistory = history.filter(id => typeof id === 'string' && id.length > 0);

      if (validHistory.length === 0) {
        setProducts([]);
        setHasHistory(false);
        setLoading(false);
        return;
      }

      setHasHistory(true);

      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .in('id', validHistory);

      if (error) {
        console.error('RecentlyVisited Logic Error:', error);
        setLoading(false);
        return;
      }

      if (data) {
        // Maintain order and normalize category structure for ProductCard
        const sortedData = validHistory
          .map(id => {
            const product = data.find(p => p.id === id);
            if (!product) return null;
            return {
              ...product,
              category: product.categories || { name: 'Collection' }
            };
          })
          .filter(p => !!p) as Product[];
        
        setProducts(sortedData);
      }
    } catch (err) {
      console.error('RecentlyVisited: Load Exception:', err);
    } finally {
      // Force loading off after any outcome
      setLoading(false);
    }
  };

  useEffect(() => {
    setHasMounted(true);
    loadHistory();
    
    // Listen for storage changes across tabs (Real-Time Sync of the list itself)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'recently-visited') loadHistory();
    };
    
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Real-Time Sync: Update details if products in history change externally
  useRealtime('products', () => {
    loadHistory();
  });

  const clearHistory = () => {
    localStorage.removeItem('recently-visited');
    setProducts([]);
    setHasHistory(false);
  };

  if (!hasMounted) return null;

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto border-t border-black/[0.03]">
      <SectionHeader 
        title1="STILL" 
        title2="CONSIDERING?" 
        subtitle="ITEMS FROM YOUR RECENT JOURNEY" 
        ctaText={(hasHistory && products.length > 0) ? "CLEAR HISTORY" : undefined}
        ctaOnClick={clearHistory}
        icon={<Trash2 size={14} />}
      />

      {loading ? (
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-[calc(50%-12px)] lg:w-[calc(20%-19.2px)] flex-shrink-0 aspect-[3/4] bg-black/[0.02] animate-pulse rounded-sm" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide animate-in fade-in duration-700">
          {products.map((product) => (
            <div key={product.id} className="w-[calc(50%-12px)] lg:w-[calc(20%-19.2px)] flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-black/[0.01] border border-black/[0.03] px-6 text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-black tracking-tight text-black uppercase">
              Your Style Journey is Just Beginning
            </h3>
            <p className="text-[10px] text-black/30 uppercase tracking-[0.4em] max-w-sm mx-auto leading-relaxed">
              Explore our latest arrivals to see your curated history here.
            </p>
          </div>
          
          <Link 
            href="/new-arrivals" 
            className="inline-block px-10 py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] hover:opacity-80 transition-all active:scale-[0.98]"
          >
            Continue Exploring
          </Link>
        </div>
      )}
    </section>
  );
};
