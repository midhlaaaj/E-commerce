'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { supabase } from '@/lib/supabase';
import { ProductCard, type Product } from '@/components/product/ProductCard';

export const RecentlyVisited = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasHistory, setHasHistory] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const loadHistory = async () => {
    // Safety check for browser environment
    if (typeof window === 'undefined') return;

    try {
      const historyJson = localStorage.getItem('recently-visited');
      const history: string[] = historyJson ? JSON.parse(historyJson) : [];

      if (!history || history.length === 0) {
        setProducts([]);
        setHasHistory(false);
        setLoading(false);
        return;
      }

      setHasHistory(true);
      // Only keep loading if we actually have IDs to fetch
      setLoading(true);

      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .in('id', history);

      if (error) {
        console.error('RecentlyVisited: Query Error:', error);
        setLoading(false);
        return;
      }

      if (data) {
        // Map data to match history order and normalize category structure
        const mappedData = data.map(p => ({
            ...p,
            category: p.categories?.name || 'Collection'
        }));

        const sortedData = history
          .map(id => mappedData.find(p => p.id === id))
          .filter(p => !!p) as Product[];
        
        setProducts(sortedData);
      }
    } catch (err) {
      console.error('RecentlyVisited: Load Exception:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHasMounted(true);
    loadHistory();
    
    // Listen for storage changes across tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'recently-visited') loadHistory();
    };
    
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-black/[0.02] animate-pulse" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 animate-in fade-in duration-700">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
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
