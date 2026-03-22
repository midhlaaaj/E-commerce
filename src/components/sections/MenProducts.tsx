import { Search, ShoppingBag } from 'lucide-react';

const products = [
  { id: 1, name: 'VALERIAN ROCK BLAZER', type: 'STRIPES / GREY FIT', price: '$250.00', image: 'https://images.unsplash.com/photo-1594932224010-74f43a183556?q=80&w=2070&auto=format&fit=crop', badge: 'NEW' },
  { id: 2, name: 'CASHMERE OVERCOAT', type: 'SOFT / MID GREY', price: '$1,250.00', image: 'https://images.unsplash.com/photo-1539533018447-63fcce267bc0?q=80&w=1974&auto=format&fit=crop', badge: 'SALE' },
  { id: 3, name: 'OXFORD POPLIN SHIRT', type: 'BLUE / WHITE', price: '$74.00', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop' },
  { id: 4, name: 'SILVERTON SLIM DENIM', type: 'RAW WASH', price: '$145.50', image: 'https://images.unsplash.com/photo-1542272604-749e75c750e3?q=80&w=1934&auto=format&fit=crop' },
  { id: 5, name: 'FABRIC CREWNECK', type: 'COFFEE / BEIGE', price: '$110.45', image: 'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?q=80&w=1974&auto=format&fit=crop', badge: 'NEW' },
  { id: 6, name: 'MODERN SLIM TIE', type: 'NAVY / STRIPE', price: '$12.00', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop' },
];

export const MenProducts = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 space-y-12 shrink-0">
        <div>
          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6 text-gray-400">FILTER BY SIZE</h3>
          <div className="flex flex-wrap gap-2">
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <button key={size} className={`w-10 h-10 border text-[10px] font-bold flex items-center justify-center rounded-sm transition-all hover:bg-black hover:text-white ${size === 'M' || size === 'XL' ? 'bg-black text-white' : 'border-gray-200 text-gray-400'}`}>
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
           <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6 text-gray-400">FILTER BY COLOR</h3>
           <div className="flex flex-wrap gap-3">
              {['#000000', '#D97706', '#94A3B8', '#F1F5F9', '#1E293B'].map((color, i) => (
                <button 
                  key={i} 
                  className={`w-6 h-6 rounded-full border border-gray-100 transition-transform hover:scale-110 active:scale-95 ${i === 0 ? 'ring-1 ring-offset-2 ring-black' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
           </div>
        </div>

        <div className="pt-8 border-t border-gray-100">
           <p className="text-[10px] text-gray-400 font-medium leading-relaxed uppercase tracking-wider">
             Our seasonal collection focuses on durable materials and timeless designs. Each piece is crafted with care for the modern minimalist.
           </p>
        </div>
      </aside>

      {/* Product Grid Area */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-4">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase">TRENDING NOW</h2>
          <div className="flex items-center gap-4">
             <button className="text-[10px] font-bold tracking-widest uppercase hover:text-[#D97706] transition-colors">SORT BY</button>
             <div className="w-[1px] h-4 bg-gray-200" />
             <Search className="w-4 h-4 text-gray-400 cursor-pointer" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-6 relative">
                {product.badge && (
                  <span className={`absolute top-4 left-4 z-10 text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-tighter ${product.badge === 'SALE' ? 'bg-[#D97706] text-white' : 'bg-black text-white'}`}>
                    {product.badge}
                  </span>
                )}
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <ShoppingBag className="w-4 h-4" />
                   </button>
                </div>
              </div>
              <h3 className="text-xs font-bold tracking-wider mb-1 uppercase line-clamp-1">{product.name}</h3>
              <p className="text-[10px] text-gray-500 mb-2 uppercase">{product.type}</p>
              <p className="text-sm font-bold text-[#D97706]">{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
