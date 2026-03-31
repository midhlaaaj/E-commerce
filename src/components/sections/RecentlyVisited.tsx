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

  const loadHistory = async () => {
    if (typeof window === 'undefined') return;

    const historyJson = localStorage.getItem('recently-visited');
    const history: string[] = historyJson ? JSON.parse(historyJson) : [];

    if (history.length === 0) {
      setProducts([]);
      setHasHistory(false);
      setLoading(false);
      return;
    }

    setHasHistory(true);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .in('id', history);

      if (error) {
        console.error('RecentlyVisited: Query Error:', error);
        throw error;
      }

      if (data) {
        // Map data to match history order
        const mappedData = data.map(p => ({
            ...p,
            category: p.categories // Mapping joined categories object
        }));

        const sortedData = history
          .map(id => mappedData.find(p => p.id === id))
          .filter(p => !!p) as Product[];
        
        setProducts(sortedData);
      }
    } catch (err) {
      console.error('RecentlyVisited: Exception:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    
    // Listen for storage changes
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

  return (
    <section className="py-8 px-6 max-w-7xl mx-auto">
      <SectionHeader 
        title1="STILL" 
        title2="CONSIDERING?" 
        subtitle="ITEMS FROM YOUR RECENT JOURNEY" 
        ctaText={products.length > 0 ? "CLEAR HISTORY" : undefined}
        ctaOnClick={clearHistory}
        icon={<Trash2 size={14} />}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-50/50 rounded-2xl border border-gray-100 font-urbanist px-6 text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-gray-900 uppercase">
              Your Style Journey is Just Beginning
            </h3>
            <p className="text-xs text-gray-400 uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
              Explore our latest arrivals to see your curated history here.
            </p>
          </div>
          
          <Link 
            href="/new-arrivals" 
            className="inline-block px-8 py-4 bg-black text-white text-[10px] font-extrabold uppercase tracking-[0.3em] hover:bg-gray-800 transition-colors rounded-none"
          >
            Continue Exploring
          </Link>
        </div>
      )}
    </section>
  );
};
