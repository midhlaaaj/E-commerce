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
        ctaLink="/shop"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sortedCards.map((card) => (
          <Link 
            key={card.id || card.section_key} 
            href={card.cta_link || '#'}
            className="group relative aspect-[4/5] md:aspect-[3/4] overflow-hidden cursor-pointer bg-gray-100"
          >
            <Image 
              src={card.image_url || '/placeholder.jpg'}
              alt={card.title || 'Category'}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            
            {/* Subtle bottom gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 transition-opacity" />
            
            <div className="absolute bottom-10 left-10 text-white">
              <h3 className="text-3xl font-extrabold tracking-tighter uppercase mb-1">
                {card.title}
              </h3>
              <div className="w-8 h-[2px] bg-white opacity-60" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
