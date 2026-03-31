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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat, i) => (
          <Link 
            key={i} 
            href={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}?gender=kids`}
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
            <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              <span className="text-white text-xl">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
