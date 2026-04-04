import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/layout/SectionHeader';

interface KidsCategoriesProps {
  initialData?: any[];
}

export const KidsCategories = ({ initialData = [] }: KidsCategoriesProps) => {
  const categories = initialData.length > 0 ? initialData : [
    { 
      name: 'BABY', 
      image_url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071&auto=format&fit=crop',
    },
    { 
      name: 'TODDLER', 
      image_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1972&auto=format&fit=crop',
    },
    { 
      name: 'JUNIOR', 
      image_url: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=2070&auto=format&fit=crop',
    }
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <SectionHeader 
        title1="KIDS'" 
        title2="COLLECTION" 
        subtitle="GROWING WITH STYLE"
        ctaText="EXPLORE ALL"
        ctaLink="/kids/collection"
        icon={<ArrowRight size={14} />}
      />
      
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-6">
        {categories.slice(0, 10).map((cat, i) => (
          <Link 
            key={i} 
            href={`/kids/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
            className={cn(
              "group block transition-all duration-500",
              i >= 6 ? "hidden md:block" : "block"
            )}
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm cursor-pointer bg-gray-50 shadow-sm hover:shadow-md transition-all duration-500">
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
                <div className="mx-auto w-4 md:w-8 h-[2px] bg-[#D97706] transition-all duration-500 group-hover:w-full md:group-hover:w-16" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
