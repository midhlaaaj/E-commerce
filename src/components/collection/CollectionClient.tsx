'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  SlidersHorizontal, 
  ChevronDown, 
  X,
  Search,
  Filter,
  ArrowUpDown,
  ShoppingBag
} from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { PriceRangeSlider } from '@/components/ui/PriceRangeSlider';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  offer_price?: number;
  gender: string;
  images: string[];
  colors: string[];
  created_at: string;
  rating: number;
  category?: { name: string };
  categories?: { name: string };
}

interface CollectionClientProps {
  gender: string;
  initialProducts: Product[];
}

export default function CollectionClient({ gender, initialProducts }: CollectionClientProps) {
  const router = useRouter();
  const [products] = useState<Product[]>(initialProducts);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  
  // Filter States
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [colorSearch, setColorSearch] = useState('');

  // Extract all unique colors from products for the filter list
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach(p => {
      if (p.colors && Array.isArray(p.colors)) {
        p.colors.forEach(c => colors.add(c));
      }
    });
    return Array.from(colors).sort();
  }, [products]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const price = p.offer_price || p.price;
      const matchesPrice = price >= priceRange.min && price <= priceRange.max;
      const matchesColor = selectedColors.length === 0 || 
        (p.colors && p.colors.some(c => selectedColors.includes(c)));
      return matchesPrice && matchesColor;
    });

    // Sorting Logic
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.offer_price || a.price) - (b.offer_price || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.offer_price || b.price) - (a.offer_price || a.price));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [products, priceRange, selectedColors, sortBy]);

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSelectedColors([]);
    setPriceRange({ min: 0, max: 50000 });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header & Sticky Controls */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-50 pt-32 pb-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb / Back */}
          <button 
            onClick={() => router.push(`/${gender}`)}
            className="group flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-all mb-8"
          >
            <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            BACK TO {gender}
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl tracking-tighter uppercase leading-none text-[#1A1614]">
                <span className="font-light">{gender}'S</span> <span className="font-extrabold">PIECES</span>
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] flex items-center gap-4">
                <span className="w-8 h-px bg-gray-200"></span>
                THE ARCHIVE / 2024
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={cn(
                  "flex items-center gap-3 px-8 py-4 border text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-none",
                  isFilterOpen ? "bg-[#1A1614] text-white border-[#1A1614]" : "bg-white text-[#1A1614] border-gray-200 hover:border-black"
                )}
              >
                <SlidersHorizontal size={14} />
                FILTERS {selectedColors.length > 0 ? `(${selectedColors.length})` : ''}
              </button>

              <div className="relative group">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 hover:border-black rounded-none px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer transition-all outline-none"
                >
                  <option value="newest">What's New</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex gap-12">
        {/* Sidebar Filters (Desktop) */}
        <aside className={cn(
          "w-72 flex-shrink-0 space-y-12 transition-all duration-500",
          isFilterOpen ? "block" : "hidden opacity-0 -translate-x-10"
        )}>
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1614]">Price Range</h3>
              {(priceRange.min > 0 || priceRange.max < 50000) && (
                 <button onClick={() => setPriceRange({ min: 0, max: 50000 })} className="text-[9px] font-bold text-[#D97706] hover:underline uppercase tracking-widest">Reset</button>
              )}
            </div>
            <PriceRangeSlider 
              min={0} 
              max={50000} 
              initialMin={priceRange.min}
              initialMax={priceRange.max}
              onChange={(min, max) => setPriceRange({ min, max })} 
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1614]">Colours</h3>
              {selectedColors.length > 0 && (
                 <button onClick={() => setSelectedColors([])} className="text-[9px] font-bold text-[#D97706] hover:underline uppercase tracking-widest">Clear ({selectedColors.length})</button>
              )}
            </div>
            
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search colour..."
                value={colorSearch}
                onChange={(e) => setColorSearch(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-[#D97706] transition-all"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {availableColors.filter(c => c.toLowerCase().includes(colorSearch.toLowerCase())).map(color => (
                <label key={color} className="flex items-center gap-3 group cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={() => toggleColor(color)}
                      className="peer w-5 h-5 border-2 border-gray-100 rounded-lg appearance-none checked:bg-black checked:border-black transition-all"
                    />
                    <div className="absolute opacity-0 peer-checked:opacity-100 text-white transition-opacity">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-black transition-colors">
                    {color}
                  </span>
                </label>
              ))}
              {availableColors.length === 0 && (
                <p className="text-[10px] text-gray-400 font-medium italic">No colour matches found in current collection.</p>
              )}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Showing {filteredProducts.length} unique pieces
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className={cn(
              "grid gap-x-6 gap-y-12 transition-all duration-500",
              isFilterOpen ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-4"
            )}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center space-y-6">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <ShoppingBag size={40} />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest mb-2">No matching pieces found</p>
                <p className="text-xs text-gray-400 font-medium max-w-xs mx-auto">Try adjusting your filters or clearing your selection to see all available styles.</p>
              </div>
              <button 
                onClick={clearFilters}
                className="px-8 py-3 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:scale-105 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
