export const MenCategories = () => {
  const categories = [
    { 
      title: 'SUITS & BLAZERS', 
      image: 'https://images.unsplash.com/photo-1594932224010-74f43a183556?q=80&w=2070&auto=format&fit=crop',
      link: '#'
    },
    { 
      title: 'CASUAL ESSENTIALS', 
      image: 'https://images.unsplash.com/photo-1516822242191-b87353f6dec5?q=80&w=2070&auto=format&fit=crop',
      link: '#'
    },
    { 
      title: 'ACCESSORIES', 
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop',
      link: '#'
    }
  ];

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <span className="text-[10px] font-bold text-[#D97706] tracking-[0.2em] uppercase">ELITE DESIGNS</span>
        <h2 className="text-2xl font-bold tracking-tight uppercase">SHOP BY CATEGORY</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <div key={i} className="group relative aspect-[4/5] overflow-hidden rounded-xl cursor-pointer">
            <img 
              src={cat.image} 
              alt={cat.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <h3 className="text-white font-bold text-xl tracking-tighter uppercase mb-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                {cat.title}
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
