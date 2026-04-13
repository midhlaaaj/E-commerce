'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  gender?: string;
}

export const OnSaleProducts = ({ initialData = [], gender }: OnSaleProductsProps) => {
  const { data: products = initialData } = useQuery({
    queryKey: ['products', 'sale', gender],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .not('offer_price', 'is', null)
        .limit(5);
      
      if (gender) {
        query = query.eq('gender', gender);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
    initialData: initialData
  });

  if (products.length === 0) return null;

  return (
    <section className="pt-12 pb-4 px-6 max-w-7xl mx-auto">
      <SectionHeader 
        title1="ON" 
        title2="SALE" 
        subtitle="EXCLUSIVE ARCHIVE REDUCTIONS" 
        ctaText="VIEW ALL" 
        ctaLink={gender ? `/${gender}/sale` : "/sale"}
        icon={<ArrowRight size={14} />}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-4">
        {products.slice(0, 10).map((product, index) => (
          <div key={product.id} className={cn(index >= 4 ? "hidden md:block" : "block")}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-10 md:hidden">
        <Link 
          href={gender ? `/${gender}/sale` : "/sale"}
          className="group flex items-center gap-4 text-[10px] font-extrabold tracking-[0.3em] uppercase transition-all"
        >
          <span className="border-b-2 border-black pb-1 group-hover:text-gray-500 group-hover:border-gray-300">
            EXPLORE ALL SALE PIECES
          </span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
        </Link>
      </div>
    </section>
  );
};
