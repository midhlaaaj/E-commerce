import Image from 'next/image';
import Link from 'next/link';

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
      <div className="mb-12">
        <span className="text-[10px] font-bold text-[#D97706] tracking-[0.2em] uppercase mb-2 block">GROWING WITH STYLE</span>
        <h2 className="text-3xl font-extrabold tracking-tight uppercase">SHOP BY COLLECTION</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {categories.map((cat, i) => (
          <Link 
            key={i} 
            href={`/kids/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
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
