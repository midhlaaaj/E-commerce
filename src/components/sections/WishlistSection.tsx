'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/store/use-wishlist-store';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ProductCard } from '@/components/product/ProductCard';

export const WishlistSection = () => {
  const { items } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until hydrated, and don't render if empty
  if (!mounted || items.length === 0) return null;

  return (
    <section className="pt-4 pb-12 px-6 max-w-7xl mx-auto">
      <SectionHeader
        title1="SAVED"
        title2="STYLES"
        subtitle="YOUR WISHLIST"
        ctaText="VIEW ALL"
        ctaLink="/wishlist"
        icon={<Heart size={14} />}
      />

      <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide animate-in fade-in duration-700">
        {items.map((product) => (
          <div key={product.id} className="w-[calc(50%-12px)] lg:w-[calc(20%-19.2px)] flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
