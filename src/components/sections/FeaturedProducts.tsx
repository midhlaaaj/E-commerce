'use client';

import { useState } from 'react';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ProductCard } from '@/components/product/ProductCard';

interface FeaturedProductsProps {
  initialData?: any[];
}

export const FeaturedProducts = ({ initialData = [] }: FeaturedProductsProps) => {
  const [products] = useState(initialData);

  if (products.length === 0) return null;

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <SectionHeader 
        title1="FEATURED" 
        title2="PIECES" 
        subtitle="A SELECTION OF OUR MOST DISTINCTIVE SEASONAL ARRIVALS." 
        className="flex-col !items-center text-center space-y-4"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            variant="rounded"
          />
        ))}
      </div>
    </section>
  );
};
