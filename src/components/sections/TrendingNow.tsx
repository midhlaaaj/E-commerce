const trendingProducts = [
  { id: 1, name: 'WOOL BLEND OVERCOAT', type: 'Camel / Oversized Fit', price: '$334.50', image: 'https://images.unsplash.com/photo-1539533018447-63fcce267bc0?q=80&w=1974&auto=format&fit=crop', badge: 'NEW' },
  { id: 2, name: 'ESSENTIAL LINEN SHIRT', type: 'Pure Linen White', price: '$84.50', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop' },
  { id: 3, name: 'RAW DENIM SLIM JEANS', type: 'Indigo / Wash', price: '$122.34', image: 'https://images.unsplash.com/photo-1542272604-749e75c750e3?q=80&w=1934&auto=format&fit=crop' },
  { id: 4, name: 'CASHMERE CREWNECK', type: 'Charcoal / Italian Wool', price: '$162.45', image: 'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?q=80&w=1974&auto=format&fit=crop', badge: 'LIMITED' },
];

export const TrendingNow = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto text-center">
      <h2 className="text-3xl font-heading font-bold tracking-tight mb-4 uppercase">TRENDING NOW</h2>
      <div className="w-16 h-1 bg-[#D97706] mx-auto mb-6" />
      <p className="text-sm text-gray-500 mb-16 max-w-2xl mx-auto">
        Influent this week's most loved pieces curated for the modern minimalist lifestyle.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
        {trendingProducts.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-6 relative">
              {product.badge && (
                <span className="absolute top-4 left-4 z-10 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                  {product.badge}
                </span>
              )}
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <h3 className="text-xs font-bold tracking-wider mb-1 uppercase">{product.name}</h3>
            <p className="text-[10px] text-gray-500 mb-2 uppercase">{product.type}</p>
            <p className="text-sm font-bold text-[#D97706]">{product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
