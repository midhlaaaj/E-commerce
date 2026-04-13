'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/layout/SectionHeader';

interface HomepageContent {
  id: string;
  section_key: string;
  title: string;
  subtitle: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
}

interface CategoriesProps {
  initialData?: HomepageContent[];
}

// Order of appearance: Men, Women, Kids
const ORDER = ['gender_men', 'gender_women', 'gender_kids'];

export const Categories = ({ initialData = [] }: CategoriesProps) => {
  const { data: cards = initialData } = useQuery({
    queryKey: ['homepage_content', 'gender_cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .in('section_key', ['gender_men', 'gender_women', 'gender_kids']);
      if (error) throw error;
      return data as HomepageContent[];
    },
    initialData: initialData
  });

  if (cards.length === 0) return null;

  // Sort them to match the target layout
  const sortedCards = [...cards].sort((a, b) => ORDER.indexOf(a.section_key) - ORDER.indexOf(b.section_key));

  return (
    <section className="pt-12 pb-6 px-6 max-w-7xl mx-auto">
      <SectionHeader 
        title1="SHOP BY" 
        title2="GENDER" 
        subtitle="CURATED COLLECTIONS" 
        ctaText="EXPLORE ALL" 
        ctaLink="/all"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6">
        {sortedCards.map((card, index) => (
          <Link 
            key={card.id || card.section_key} 
            href={card.cta_link || '#'}
            className={cn(
              "group block transition-all duration-500",
              index === 2 ? "col-span-2 md:col-span-1 w-[calc(50%-4px)] md:w-full mx-auto" : ""
            )}
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm cursor-pointer bg-gray-100 shadow-sm hover:shadow-md transition-all duration-500">
              <Image 
                src={card.image_url || '/placeholder.jpg'}
                alt={card.title || 'Category'}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              
              {/* Content Overlay */}
              <div className="absolute bottom-4 md:bottom-8 left-3 md:left-8 right-3 md:right-8 text-white">
                <h3 className="text-xl md:text-3xl font-black tracking-tighter uppercase mb-2 drop-shadow-sm leading-none">
                  {card.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
