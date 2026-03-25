import Image from 'next/image';

interface KidsCategoriesProps {
  initialData?: any[];
}

export const KidsCategories = ({ initialData = [] }: KidsCategoriesProps) => {
  const categories = initialData.length > 0 ? initialData : [
    { 
      name: 'BABY', 
      image_url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071&auto=format&fit=crop',
      color: 'bg-[#FDF2F0]'
    },
    { 
      name: 'TODDLER', 
      image_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1972&auto=format&fit=crop',
      color: 'bg-[#FEF3C7]'
    },
    { 
      name: 'JUNIOR', 
      image_url: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=2070&auto=format&fit=crop',
      color: 'bg-[#ECFDF5]'
    }
  ];

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <span className="text-[10px] font-bold text-[#D97706] tracking-[0.2em] uppercase">GROWING WITH STYLE</span>
        <h2 className="text-2xl font-bold tracking-tight uppercase">SHOP BY COLLECTION</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <div key={i} className="group relative aspect-[4/5] overflow-hidden rounded-xl cursor-pointer">
            <div className={`w-full h-full ${cat.color} relative`}>
               <Image 
                 src={cat.image_url} 
                 alt={cat.name}
                 fill
                 className="object-cover transition-transform duration-700 group-hover:scale-110"
                 sizes="(max-width: 768px) 100vw, 33vw"
               />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <h3 className="text-white font-bold text-xl tracking-tighter uppercase mb-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                {cat.name}
              </h3>
            </div>
            <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-white text-xl">→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
