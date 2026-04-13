'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HeroProps {
  initialData?: any;
}

export const Hero = ({ initialData }: HeroProps) => {
  const { data: content = initialData } = useQuery({
    queryKey: ['homepage_content', 'main_hero'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .eq('section_key', 'main_hero')
        .single();
      if (error) throw error;
      return data;
    },
    initialData: initialData
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Support dual titles: Use | separator if present, otherwise bold the last word automatically
  const titleText = content?.title || 'MODERN | ELEGANCE';
  let titlePart1 = '';
  let titlePart2 = '';
  
  if (titleText.includes('|')) {
    [titlePart1, titlePart2] = titleText.split('|').map((s: string) => s.trim());
  } else {
    const words = titleText.split(' ');
    if (words.length > 1) {
      titlePart2 = words.pop() || '';
      titlePart1 = words.join(' ');
    } else {
      titlePart1 = titleText;
    }
  }

  return (
    <section className="relative h-screen md:h-screen w-full flex items-end overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0">
        {/* Desktop Image */}
        <Image 
          src={content?.image_url || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974&auto=format&fit=crop'}
          alt="Hero Background Desktop"
          fill
          priority
          className={cn(
            "object-cover brightness-[0.75] select-none",
            content?.mobile_image_url ? "hidden md:block" : "block"
          )}
          sizes="100vw"
          quality={100}
        />
        
        {/* Mobile-Specific Image (if available) */}
        {content?.mobile_image_url && (
          <Image 
            src={content.mobile_image_url}
            alt="Hero Background Mobile"
            fill
            priority
            className="object-cover brightness-[0.75] select-none block md:hidden"
            sizes="100vw"
            quality={100}
          />
        )}
        
        {/* Subtle Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>
      
      {/* Content Area */}
      <div className="relative z-10 w-full px-6 md:px-20 pb-24 md:pb-32 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        <div className="max-w-4xl space-y-4 md:space-y-10">
          <p className="text-[10px] md:text-[11px] font-bold tracking-[0.5em] uppercase text-white/90">
            {content?.subtitle || 'WINTER COLLECTION 2024'}
          </p>
          
          <div className="flex flex-col space-y-0 translate-x-[-2px] md:translate-x-0 font-roboto">
            <h1 
              className="text-7xl md:text-9xl font-thin tracking-tighter md:tracking-tight leading-[0.85] md:leading-none text-white uppercase drop-shadow-sm opacity-95"
            >
              {titlePart1}
            </h1>
            {titlePart2 && (
              <h1 
                className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white uppercase drop-shadow-md"
              >
                {titlePart2}
              </h1>
            )}
          </div>

          <div className="flex flex-row md:flex-row items-center gap-3 md:gap-4 pt-4 md:pt-6">
            <Link href="/all">
              <button className="bg-white text-black px-6 py-3.5 md:px-12 md:py-5 text-[9px] md:text-[10px] font-black md:font-bold uppercase tracking-[0.2em] min-w-[140px] md:min-w-[180px] hover:bg-gray-200 transition-all active:scale-95 rounded-none">
                {content?.cta_text || 'SHOP COLLECTION'}
              </button>
            </Link>
            <Link href="/lookbook">
              <button className="bg-transparent border border-white/40 text-white px-6 py-3.5 md:px-12 md:py-5 text-[9px] md:text-[10px] font-black md:font-bold uppercase tracking-[0.2em] min-w-[140px] md:min-w-[180px] hover:bg-white hover:text-black hover:border-white transition-all active:scale-95 rounded-none">
                {content?.cta_secondary_text || 'LOOKBOOK'}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
