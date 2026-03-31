import Image from 'next/image';
import Link from 'next/link';

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
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <span className="text-[10px] font-bold text-[#D97706] tracking-[0.2em] uppercase mb-2 block">CURATED SELECTION</span>
        <h2 className="text-3xl font-extrabold tracking-tight uppercase">SHOP BY CATEGORY</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat, i) => (
          <Link 
            key={i} 
            href={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}?gender=women`}
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
