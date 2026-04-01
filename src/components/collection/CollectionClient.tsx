'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
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
  gender?: string;
  initialProducts: Product[];
  title1?: string;
  title2?: string;
  subtitle?: string;
  backLink?: string;
  backLabel?: string;
}

export default function CollectionClient({ 
  gender, 
  initialProducts,
  title1,
  title2,
  subtitle,
  backLink,
  backLabel
}: CollectionClientProps) {
  const router = useRouter();
  const [products] = useState<Product[]>(initialProducts);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const sortRef = useRef<HTMLDivElement>(null);
  
  // Dynamic Price Range Calculation based on actual products
  const { minAvailablePrice, maxAvailablePrice } = useMemo(() => {
    if (products.length === 0) return { minAvailablePrice: 0, maxAvailablePrice: 50000 };
    
    let min = Infinity;
    let max = -Infinity;
    
    products.forEach(p => {
      const price = p.offer_price || p.price;
      if (price < min) min = price;
      if (price > max) max = price;
    });
    
    return { 
      minAvailablePrice: Math.floor(min / 100) * 100, // Round down to nearest 100
      maxAvailablePrice: Math.ceil(max / 100) * 100   // Round up to nearest 100
    };
  }, [products]);

  // Filter States
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [colorSearch, setColorSearch] = useState('');

  // Update price range when min/max price bounds change (e.g. category switch)
  useEffect(() => {
    setPriceRange({ min: minAvailablePrice, max: maxAvailablePrice });
  }, [minAvailablePrice, maxAvailablePrice]);

  // Click outside to close sort dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortOptions = [
    { value: 'newest', label: "What's New" },
    { value: 'price-low', label: 'Price Low' },
    { value: 'price-high', label: 'Price High' },
    { value: 'rating', label: 'Rating' }
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || "Sort By";

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
    setPriceRange({ min: minAvailablePrice, max: maxAvailablePrice });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-28">
        {/* Breadcrumb / Back */}
        <button 
          onClick={() => router.push(backLink || `/${gender}`)}
          className="group flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-all mb-6"
        >
          <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
          {backLabel || (backLink ? 'BACK' : `BACK TO ${gender}`)}
        </button>

        {/* Header (Matching NewArrivals style) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl tracking-tighter uppercase leading-none text-[#1A1614]">
              <span className="font-light">{title1 || `${gender}'S`}</span> <span className="font-extrabold">{title2 || (gender === 'kids' ? 'COLLECTION' : 'PIECES')}</span>
            </h1>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.4em]">
              {subtitle || `Showing ${filteredProducts.length} unique pieces`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "flex items-center gap-2 px-8 py-3 border text-[10px] font-bold uppercase tracking-widest transition-all rounded-none",
                isFilterOpen ? "bg-[#1A1614] text-white border-[#1A1614]" : "bg-white text-[#1A1614] border-gray-100 hover:border-black"
              )}
            >
              <SlidersHorizontal size={14} />
              Filters {selectedColors.length > 0 ? `(${selectedColors.length})` : ''}
            </button>

            <div className="relative" ref={sortRef}>
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center justify-between gap-8 px-8 py-3 border border-gray-100 hover:border-black bg-white text-[10px] font-bold uppercase tracking-widest transition-all rounded-none min-w-[180px]"
              >
                <span>{currentSortLabel}</span>
                <ChevronDown size={14} className={cn("transition-transform duration-300", isSortOpen && "rotate-180")} />
              </button>

              {isSortOpen && (
                <div className="absolute top-full right-0 mt-1 w-full bg-white border border-gray-100 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-8 py-3 text-[9px] font-bold uppercase tracking-widest transition-colors",
                          sortBy === option.value ? "bg-gray-50 text-black" : "text-gray-400 hover:bg-gray-50 hover:text-black"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-12">
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-16 flex gap-12">
        {/* Sidebar Filters (Desktop) */}
        <aside className={cn(
          "w-72 flex-shrink-0 space-y-12 transition-all duration-500",
          isFilterOpen ? "block" : "hidden opacity-0 -translate-x-10"
        )}>
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1614]">Price Range</h3>
              {(priceRange.min > minAvailablePrice || priceRange.max < maxAvailablePrice) && (
                 <button onClick={() => setPriceRange({ min: minAvailablePrice, max: maxAvailablePrice })} className="text-[9px] font-bold text-[#D97706] hover:underline uppercase tracking-widest">Reset</button>
              )}
            </div>
            <PriceRangeSlider 
              min={minAvailablePrice} 
              max={maxAvailablePrice} 
              valueMin={priceRange.min}
              valueMax={priceRange.max}
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
