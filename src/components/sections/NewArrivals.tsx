'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ProductCard } from '@/components/product/ProductCard';

interface NewArrivalsProps {
  initialData?: any[];
  gender?: string;
}

export const NewArrivals = ({ initialData = [], gender }: NewArrivalsProps) => {
  const { data: products = initialData } = useQuery({
    queryKey: ['products', 'new-arrivals', gender],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (gender) {
        const genderFilter = (gender === 'men' || gender === 'women') 
          ? [gender, 'unisex'] 
          : [gender];
        query = query.in('gender', genderFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    initialData: initialData
  });

  if (products.length === 0) return null;

  return (
    <section className="pt-6 pb-4 px-6 max-w-7xl mx-auto">
      <SectionHeader 
        title1="NEW" 
        title2="ARRIVALS" 
        subtitle="CURATED FOR THE ARCHIVE" 
        ctaText="VIEW ALL" 
        ctaLink={gender ? `/${gender}/new-arrivals` : "/new-arrivals"}
        icon={<ArrowRight size={14} />}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-4 md:mb-16">
        {products.slice(0, 10).map((product, index) => (
          <div key={product.id} className={cn(index >= 4 ? "hidden md:block" : "block")}>
            <ProductCard 
              product={product} 
              badge={index === 0 ? "NEW" : index === 3 ? "LIMITED" : undefined}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-4 md:hidden">
        <Link 
          href={gender ? `/${gender}/new-arrivals` : "/new-arrivals"}
          className="group flex items-center gap-4 text-[10px] font-extrabold tracking-[0.3em] uppercase transition-all"
        >
          <span className="border-b-2 border-black pb-1 group-hover:text-gray-500 group-hover:border-gray-300">
            EXPLORE ALL NEW ARRIVALS
          </span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
        </Link>
      </div>
    </section>
  );
};
