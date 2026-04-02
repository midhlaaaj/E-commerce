import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/layout/SectionHeader';

interface WomenCategoriesProps {
  initialData?: any[];
}

export const WomenCategories = ({ initialData = [] }: WomenCategoriesProps) => {
  const categories = initialData.length > 0 ? initialData : [
    { 
      name: 'DRESSES', 
      image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1983&auto=format&fit=crop',
    },
    { 
      name: 'KNITWEAR', 
      image_url: 'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?q=80&w=1965&auto=format&fit=crop',
    },
    { 
      name: 'OUTERWEAR', 
      image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop',
    }
  ];

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <SectionHeader 
        title1="SHOP BY" 
        title2="CATEGORY" 
        subtitle="CURATED SELECTION"
        ctaText="EXPLORE ALL"
        ctaLink="/women"
        icon={<ArrowRight size={14} />}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {categories.map((cat, i) => (
          <Link 
            key={i} 
            href={`/women/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="group block"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer bg-gray-50 bg-white shadow-sm hover:shadow-xl transition-all duration-500 mb-4">
              <Image 
                src={cat.image_url} 
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] transition-colors group-hover:text-[#D97706]">
              {cat.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};
