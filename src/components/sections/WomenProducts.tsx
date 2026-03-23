import { Search, ShoppingBag } from 'lucide-react';

const products = [
  { id: 1, name: 'SILK MIDI DRESS', type: 'SAND / SATIN FINISH', price: '$198.00', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1976&auto=format&fit=crop', badge: 'NEW' },
  { id: 2, name: 'STRUCTURED WOOL COAT', type: 'OLIVE / TAILORED', price: '$345.00', image: 'https://images.unsplash.com/photo-1539533018447-63fcce267bc0?q=80&w=1974&auto=format&fit=crop', badge: 'TRENDING' },
  { id: 3, name: 'SOFT CASHMERE SWEATER', type: 'GREY / RELAXED', price: '$145.00', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop' },
  { id: 4, name: 'PLEATED WIDE TROUSERS', type: 'BEIGE / HIGH-RISE', price: '$120.00', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1974&auto=format&fit=crop' },
  { id: 5, name: 'LEATHER MOTOR JACKET', type: 'BROWN / SLIM', price: '$450.00', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1970&auto=format&fit=crop', badge: 'LIMITED' },
  { id: 6, name: 'V-NECK KNIT TOP', type: 'OATMEAL / SOFT', price: '$85.00', image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=2022&auto=format&fit=crop' },
];

export const WomenProducts = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 space-y-12 shrink-0">
        <div>
          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6 text-gray-400">FILTER BY SIZE</h3>
          <div className="flex flex-wrap gap-2">
            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
              <button key={size} className={`w-10 h-10 border text-[10px] font-bold flex items-center justify-center rounded-sm transition-all hover:bg-black hover:text-white ${size === 'S' || size === 'L' ? 'bg-black text-white' : 'border-gray-200 text-gray-400'}`}>
                {size}
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
                  className={`w-6 h-6 rounded-full border border-gray-100 transition-transform hover:scale-110 active:scale-95 ${i === 1 ? 'ring-1 ring-offset-2 ring-black' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
           </div>
        </div>

        <div className="pt-8 border-t border-gray-100">
           <p className="text-[10px] text-gray-400 font-medium leading-relaxed uppercase tracking-wider italic">
             "Simplicity is the keynote of all true elegance."
           </p>
        </div>
      </aside>

      {/* Product Grid Area */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-4">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase">COLLECTION PIECES</h2>
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
                  <span className={`absolute top-4 left-4 z-10 text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-tighter ${product.badge === 'TRENDING' ? 'bg-[#D97706] text-white' : 'bg-black text-white'}`}>
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
        
        <div className="mt-16 text-center">
           <button className="border border-gray-200 px-10 py-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all rounded-sm">
              LOAD MORE PIECES
           </button>
        </div>
      </div>
    </section>
  );
};
