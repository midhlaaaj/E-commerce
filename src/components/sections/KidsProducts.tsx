import { Search, ShoppingBag } from 'lucide-react';

const products = [
  { id: 1, name: 'QUILTED PUFFER JACKET', type: 'OLIVE / WINTER-READY', price: '$85.00', image: 'https://images.unsplash.com/photo-1532332248502-28b41fd5ff91?q=80&w=2070&auto=format&fit=crop', badge: 'TOP SELLER' },
  { id: 2, name: 'SOFT KNIT SWEATER', type: 'BEIGE / COTTON', price: '$45.00', image: 'https://images.unsplash.com/photo-1519234164452-454ad1272375?q=80&w=1974&auto=format&fit=crop', badge: 'NEW' },
  { id: 3, name: 'DENIM OVERALLS', type: 'RAW BLUE / PLAY-RESISTANT', price: '$55.00', image: 'https://images.unsplash.com/photo-1519457431-75514b711b7b?q=80&w=1974&auto=format&fit=crop' },
  { id: 4, name: 'STRIPED LONG SLEEVE', type: 'NAVY/WHITE / ORGANIC', price: '$28.00', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2070&auto=format&fit=crop' },
  { id: 5, name: 'COZY KNIT BOOTIES', type: 'OATMEAL / WOOL BLEND', price: '$24.00', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080&auto=format&fit=crop', badge: 'SALE' },
  { id: 6, name: 'CANVAS CARGO PANTS', type: 'KHAKI / DURABLE', price: '$42.00', image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=2080&auto=format&fit=crop' },
];

export const KidsProducts = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 space-y-12 shrink-0">
        <div>
          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6 text-gray-400">FILTER BY AGE</h3>
          <div className="flex flex-col gap-2">
            {['0-2 YEARS', '2-6 YEARS', '6-14 YEARS'].map((age) => (
              <button key={age} className={`w-full text-left py-2 border-b text-[10px] font-bold uppercase transition-all hover:text-black ${age === '2-6 YEARS' ? 'text-black border-black' : 'border-gray-100 text-gray-400'}`}>
                {age}
              </button>
            ))}
          </div>
        </div>

        <div>
           <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6 text-gray-400">FILTER BY COLOR</h3>
           <div className="flex flex-wrap gap-3">
              {['#000000', '#D97706', '#94A3B8', '#F1F5F9', '#1E293B', '#7C2D12'].map((color, i) => (
                <button 
                  key={i} 
                  className={`w-6 h-6 rounded-full border border-gray-100 transition-transform hover:scale-110 active:scale-95 ${i === 2 ? 'ring-1 ring-offset-2 ring-black' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
           </div>
        </div>

        <div className="pt-8 border-t border-gray-100">
           <p className="text-[10px] text-gray-400 font-medium leading-relaxed uppercase tracking-wider">
             GROWING WITH STYLE. MADE FOR PLAY. Our collection focuses on durable materials and playful designs for the next generation.
           </p>
        </div>
      </aside>

      {/* Product Grid Area */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-4">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase">KIDS SELECTIONS</h2>
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
                  <span className={`absolute top-4 left-4 z-10 text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-tighter ${product.badge === 'TOP SELLER' || product.badge === 'SALE' ? 'bg-[#D97706] text-white' : 'bg-black text-white'}`}>
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
