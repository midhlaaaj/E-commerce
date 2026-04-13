'use client';

import { useEffect, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { supabase } from '@/lib/supabase';
import { ProductCard, type Product } from '@/components/product/ProductCard';

export const RecentlyVisited = ({ hideWhenEmpty = false }: { hideWhenEmpty?: boolean }) => {
  const [hasMounted, setHasMounted] = useState(false);

  // 1. Fetch History from LocalStorage
  const history = useMemo(() => {
    if (typeof window === 'undefined') return [];
    try {
      const historyJson = localStorage.getItem('recently-visited');
      const parsed: string[] = historyJson ? JSON.parse(historyJson) : [];
      return parsed.filter(id => typeof id === 'string' && id.length > 0);
    } catch {
      return [];
    }
  }, [hasMounted]);

  // 2. Fetch Products via React Query
  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ['recently-visited', history],
    queryFn: async () => {
      if (history.length === 0) return [];

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `)
        .in('id', history);

      if (error) throw error;

      // Keep original order
      return history
        .map(id => {
          const product = (data as any[]).find((p: any) => p.id === id);
          if (!product) return null;
          return {
            ...product,
            category: product.categories || { name: 'Collection' }
          };
        })
        .filter(Boolean) as Product[];
    },
    enabled: history.length > 0
  });

  useEffect(() => {
    setHasMounted(true);

    const handleUpdate = () => {
      // Re-trigger history memo update
      setHasMounted(prev => !prev);
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('recently-visited-updated', handleUpdate);
    
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('recently-visited-updated', handleUpdate);
    };
  }, []);

  // Don't render until hydrated
  if (!hasMounted) return null;
  // On cart page, hide entirely when no history
  if (hideWhenEmpty && !loading && products.length === 0) return null;

  return (
    <section className="pt-4 pb-12 px-6 max-w-7xl mx-auto">
      <SectionHeader
        title1="STILL"
        title2="CONSIDERING?"
        subtitle="ITEMS FROM YOUR RECENT JOURNEY"
        ctaText={products.length > 0 ? "CLEAR HISTORY" : undefined}
        ctaOnClick={() => {
          localStorage.removeItem('recently-visited');
          // Re-trigger history update
          setHasMounted(prev => !prev);
        }}
        icon={<Trash2 size={14} />}
      />

      {loading ? (
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-[calc(50%-12px)] lg:w-[calc(20%-19.2px)] flex-shrink-0 aspect-[3/4] bg-black/[0.02] animate-pulse rounded-sm" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-black/[0.01] border border-black/[0.03] px-6 text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-black tracking-tight text-black uppercase">
              Your Style Journey is Just Beginning
            </h3>
            <p className="text-[10px] text-black/30 uppercase tracking-[0.4em] max-w-sm mx-auto leading-relaxed">
              Explore our latest arrivals to see your curated history here.
            </p>
          </div>
          <a
            href="/new-arrivals"
            className="inline-block px-10 py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] hover:opacity-80 transition-all active:scale-[0.98]"
          >
            Continue Exploring
          </a>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide animate-in fade-in duration-700">
          {products.map((product) => (
            <div key={product.id} className="w-[calc(50%-12px)] lg:w-[calc(20%-19.2px)] flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
