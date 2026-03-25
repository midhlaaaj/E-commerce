'use client';

import { useState } from 'react';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ProductCard } from '@/components/product/ProductCard';

interface NewArrivalsProps {
  initialData?: any[];
}

export const NewArrivals = ({ initialData = [] }: NewArrivalsProps) => {
  const [products] = useState(initialData);

  if (products.length === 0) return null;

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <SectionHeader 
        title1="NEW" 
        title2="ARRIVALS" 
        subtitle="CURATED FOR THE ARCHIVE" 
        ctaText="VIEW ALL" 
        ctaLink="/new-arrivals"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            badge={index === 0 ? "NEW" : index === 3 ? "LIMITED" : undefined}
          />
        ))}
      </div>
    </section>
  );
};
