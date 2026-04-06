import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/layout/SectionHeader';

interface MenCategoriesProps {
  initialData?: any[];
}

export const MenCategories = ({ initialData = [] }: MenCategoriesProps) => {
  const categories = initialData.length > 0 ? initialData : [
    { 
      name: 'SUITS & BLAZERS', 
      image_url: 'https://images.unsplash.com/photo-1594932224010-74f43a183556?q=80&w=2070&auto=format&fit=crop',
    },
    { 
      name: 'CASUAL ESSENTIALS', 
      image_url: 'https://images.unsplash.com/photo-1516822242191-b87353f6dec5?q=80&w=2070&auto=format&fit=crop',
    },
    { 
      name: 'ACCESSORIES', 
      image_url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop',
    }
  ];

  return (
    <section className="pt-12 pb-6 px-6 max-w-7xl mx-auto">
      <SectionHeader 
        title1="SHOP BY" 
        title2="CATEGORY" 
        subtitle="ELITE DESIGNS"
        ctaText="EXPLORE ALL"
        ctaLink="/men/collection"
        icon={<ArrowRight size={14} />}
      />
      
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-6">
        {categories.slice(0, 10).map((cat, i) => (
          <Link 
            key={i} 
            href={`/men/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
            className={cn(
              "group block transition-all duration-500",
              i >= 6 ? "hidden md:block" : "block"
            )}
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm cursor-pointer bg-gray-50 transition-all duration-500">
              <Image 
                src={cat.image_url} 
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                sizes="(max-width: 768px) 33vw, 20vw"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              
              {/* Content Overlay */}
              <div className="absolute bottom-3 md:bottom-6 left-2 md:left-6 right-2 md:right-6 text-white text-center">
                <h3 className="text-[10px] md:text-xl font-black tracking-tighter uppercase mb-2 drop-shadow-sm transition-transform duration-500 group-hover:-translate-y-1 leading-tight">
                  {cat.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
