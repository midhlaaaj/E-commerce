export const WomenCategories = () => {
  const categories = [
    { 
      title: 'DRESSES', 
      image: '/assets/women_cat_dresses.png',
      link: '#'
    },
    { 
      title: 'KNITWEAR', 
      image: '/assets/women_cat_knitwear.png',
      link: '#'
    },
    { 
      title: 'OUTERWEAR', 
      image: '/assets/women_cat_outerwear.png',
      link: '#'
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
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-50 mb-6">
              <img 
                src={cat.image} 
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
            </div>
            <div className="text-center">
               <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-2 group-hover:text-[#D97706] transition-colors">{cat.title}</h3>
               <div className="w-8 h-[2px] bg-gray-200 mx-auto transition-all group-hover:w-16 group-hover:bg-[#D97706]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
