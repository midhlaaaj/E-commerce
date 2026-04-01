import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <SectionHeader 
        title1="SHOP BY" 
        title2="CATEGORY" 
        subtitle="ELITE DESIGNS"
        ctaText="EXPLORE ALL"
        ctaLink="/men"
        icon={<ArrowRight size={14} />}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat, i) => (
          <Link 
            key={i} 
            href={`/men/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="group relative aspect-[4/5] overflow-hidden rounded-xl cursor-pointer bg-gray-50 bg-white shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <Image 
              src={cat.image_url} 
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 h-1/2 flex items-end">
              <h3 className="text-white font-extrabold text-2xl tracking-tighter uppercase mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                {cat.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
