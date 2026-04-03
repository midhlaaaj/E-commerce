'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface MenHeroProps {
  initialData?: any;
}

export const MenHero = ({ initialData }: MenHeroProps) => {
  const content = initialData;
  
  // Support dual titles: Use | separator if present, otherwise bold the last word automatically
  const titleText = content?.title || "MEN'S | SELECTION";
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
    <section className="relative h-[85vh] md:h-screen w-full flex items-end overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0">
        {/* Desktop Image */}
        <Image 
          src={content?.image_url || "https://images.unsplash.com/photo-1488161628813-244aa2f87735?q=80&w=1964&auto=format&fit=crop"} 
          alt={content?.title || "Men's Selection Desktop"}
          fill
          priority
          className={cn(
            "object-cover brightness-[0.75]",
            content?.mobile_image_url ? "hidden md:block" : "block"
          )}
          sizes="100vw"
        />
        
        {/* Mobile-Specific Image (if available) */}
        {content?.mobile_image_url && (
          <Image 
            src={content.mobile_image_url}
            alt={content?.title || "Men's Selection Mobile"}
            fill
            priority
            className="object-cover brightness-[0.75] block md:hidden"
            sizes="100vw"
          />
        )}
        
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>
      
      {/* Content Area */}
      <div className="relative z-10 w-full px-6 md:px-20 pb-24 md:pb-32 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        <div className="max-w-3xl space-y-8">
          <p className="text-[10px] md:text-[11px] font-bold tracking-[0.5em] uppercase text-white/90">
            {content?.subtitle || 'SEASON LIMITED'}
          </p>
          
          <div className="flex flex-col space-y-0">
            <h1 className="text-5xl md:text-9xl font-thin tracking-tight leading-none text-white uppercase drop-shadow-sm">
              {titlePart1}
            </h1>
            {titlePart2 && (
              <h1 className="text-5xl md:text-9xl font-bold tracking-tighter leading-[0.85] text-white uppercase drop-shadow-md">
                {titlePart2}
              </h1>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
            <Link href={content?.cta_link === '/men' ? '/men/collection' : (content?.cta_link || '/men/collection')}>
              <button className="bg-white text-black px-12 py-5 text-[10px] font-bold uppercase tracking-[0.2em] min-w-[180px] hover:bg-gray-200 transition-all active:scale-95 rounded-none">
                {content?.cta_text || 'SHOP NOW'}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
