'use client';

import { useEffect, useState } from 'react';
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

  if (loading) return null;

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <SectionHeader 
        title1="STILL" 
        title2="CONSIDERING?" 
        subtitle="ITEMS FROM YOUR RECENT JOURNEY" 
        ctaText={products.length > 0 ? "CLEAR HISTORY" : undefined}
        ctaOnClick={clearHistory}
        className="!items-end"
      />

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
            Nothing to show
          </p>
        </div>
      )}
    </section>
  );
};
