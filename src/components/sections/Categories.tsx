'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
  const [cards] = useState(initialData);

  if (cards.length === 0) return null;

  // Sort them to match the target layout
  const sortedCards = [...cards].sort((a, b) => ORDER.indexOf(a.section_key) - ORDER.indexOf(b.section_key));

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <SectionHeader 
        title1="SHOP BY" 
        title2="GENDER" 
        subtitle="CURATED COLLECTIONS" 
        ctaText="EXPLORE ALL" 
        ctaLink="/all"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sortedCards.map((card) => (
          <Link 
            key={card.id || card.section_key} 
            href={card.cta_link || '#'}
            className="group block"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 mb-6">
              <Image 
                src={card.image_url || '/placeholder.jpg'}
                alt={card.title || 'Category'}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            
            <h3 className="text-xl font-extrabold tracking-tighter uppercase mb-1 transition-colors group-hover:text-[#D97706]">
              {card.title}
            </h3>
            <div className="w-8 h-[2px] bg-[#D97706] transition-all group-hover:w-16" />
          </Link>
        ))}
      </div>
    </section>
  );
};
