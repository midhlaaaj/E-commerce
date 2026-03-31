'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ProductCard } from '@/components/product/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  offer_price?: number;
  images: string[];
  is_featured: boolean;
  is_sale: boolean;
}

interface OnSaleProductsProps {
  initialData?: Product[];
}

export const OnSaleProducts = ({ initialData = [] }: OnSaleProductsProps) => {
  const [products] = useState(initialData);

  if (products.length === 0) return null;

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <SectionHeader 
        title1="ON" 
        title2="SALE" 
        subtitle="LIMITED TIME MARKDOWNS" 
        ctaText="VIEW ALL" 
        ctaLink="/sale"
        icon={<ArrowRight size={14} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
