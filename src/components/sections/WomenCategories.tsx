import Image from 'next/image';

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
      <div className="text-center mb-16">
        <span className="text-[10px] font-bold text-[#D97706] tracking-[0.4em] uppercase">CURATED SELECTION</span>
        <h2 className="text-4xl font-heading font-bold tracking-tighter uppercase mt-2">SHOP THE EDIT</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-50 mb-6 shadow-xl shadow-black/5 group-hover:shadow-black/10 transition-all duration-700">
              <Image 
                src={cat.image_url} 
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
            </div>
            <div className="text-center">
               <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-2 group-hover:text-[#D97706] transition-colors">{cat.name}</h3>
               <div className="w-8 h-[2px] bg-gray-200 mx-auto transition-all group-hover:w-16 group-hover:bg-[#D97706]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
