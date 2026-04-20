'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search as SearchIcon, 
  ArrowLeft, 
  X, 
  TrendingUp, 
  Clock,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ProductCard, Product } from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';

export default function SearchClient() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // Load recent searches
    const saved = localStorage.getItem('recent_searches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  // Algorithm for Auto-suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const lowerQuery = query.toLowerCase();
        const genders = ['men', 'women', 'kids'];
        const matchedGender = genders.find(g => lowerQuery.includes(g));
        const searchTerm = matchedGender ? lowerQuery.replace(matchedGender, '').trim() : lowerQuery;

        // 1. Fetch matching categories
        let catQuery = supabase.from('categories').select('id, name, gender');
        
        if (matchedGender) {
          catQuery = catQuery.eq('gender', matchedGender);
        }
        
        if (searchTerm) {
          catQuery = catQuery.ilike('name', `%${searchTerm}%`);
        }

        const { data: categories } = await catQuery.limit(10);

        // 2. Fetch matching products (just a few)
        const { data: products } = await supabase
          .from('products')
          .select('name, id')
          .ilike('name', `%${query}%`)
          .limit(5);

        const genderMap: any = { men: 'Men', women: 'Women', kids: 'Kids' };
        let combined: any[] = [];
        
        // Add gender + category combinations
        if (categories) {
          categories.forEach((cat: any) => {
            combined.push({
              type: 'category',
              label: `${genderMap[cat.gender] || 'All'} ${cat.name}`,
              query: `${cat.gender} ${cat.name}`,
              gender: cat.gender,
              categoryName: cat.name,
              categoryId: cat.id
            });
          });
        }

        // Add direct product name matches (if not already in categories)
        if (products) {
          products.forEach((p: any) => {
            if (!combined.some(c => c.label === p.name)) {
              combined.push({
                type: 'product',
                label: p.name,
                id: p.id
              });
            }
          });
        }

        setSuggestions(combined);
      } catch (err) {
        console.error('Suggestion Error:', err);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async (searchQuery: string, filters?: any) => {
    if (!searchQuery.trim()) return;

    // Handle direct product navigation
    if (filters?.type === 'product' && filters.id) {
      router.push(`/product/${filters.id}`);
      return;
    }
    
    setLoading(true);
    setIsSearching(true);
    setSuggestions([]);
    
    // Save to recent
    const updatedRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recent_searches', JSON.stringify(updatedRecent));

    try {
      let baseQuery = supabase.from('products').select('*, category:category_id(name)');
      
      const lowerQuery = searchQuery.toLowerCase();
      const genders = ['men', 'women', 'kids'];
      const matchedGender = genders.find(g => lowerQuery.includes(g));
      const searchTerm = matchedGender ? lowerQuery.replace(matchedGender, '').trim() : lowerQuery;

      if (filters) {
        if (filters.gender) {
          if (filters.gender === 'kids') {
            baseQuery = baseQuery.eq('gender', 'kids');
          } else {
            baseQuery = baseQuery.in('gender', [filters.gender, 'unisex']);
          }
        }
        if (filters.categoryId) {
          baseQuery = baseQuery.eq('category_id', filters.categoryId);
        }
      } else if (matchedGender || searchTerm) {
        // Intelligently parse manual search queries like "men shirt"
        if (matchedGender) {
          if (matchedGender === 'kids') {
            baseQuery = baseQuery.eq('gender', 'kids');
          } else {
            baseQuery = baseQuery.in('gender', [matchedGender, 'unisex']);
          }
        }
        
        if (searchTerm) {
          // Check if the searchTerm matches a category name first for better results
          let catQuery = supabase
            .from('categories')
            .select('id')
            .ilike('name', `%${searchTerm}%`);
            
          if (matchedGender) {
            catQuery = catQuery.eq('gender', matchedGender);
          }

          const { data: categories } = await catQuery;

          if (categories && categories.length > 0) {
            const catIds = categories.map((c: any) => c.id).join(',');
            baseQuery = baseQuery.or(`category_id.in.(${catIds}),name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
          } else {
            // General text search fallback
            baseQuery = baseQuery.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
          }
        }
      } else {
        // Fallback for extremely broad searches
        baseQuery = baseQuery.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await baseQuery;
      if (error) throw error;
      setResults(data || []);
    } catch (err) {
      console.error('Search Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Premium Search Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIsSearching(false); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Search for products"
            className="w-full bg-transparent border-none focus:ring-0 text-base font-medium placeholder:text-gray-400 outline-none"
          />
          {query && (
            <button 
              onClick={() => { setQuery(''); setSuggestions([]); setIsSearching(false); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
            >
              <X size={18} className="text-gray-400" />
            </button>
          )}
        </div>

        <button 
          onClick={() => handleSearch(query)}
          className="p-1"
        >
          <SearchIcon size={24} className="text-gray-400" />
        </button>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pb-10">
        {!isSearching && !query && (
          <div className="px-6 py-8 space-y-10">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Recent Searches</h3>
                  <button 
                    onClick={() => {
                      setRecentSearches([]);
                      localStorage.removeItem('recent_searches');
                    }}
                    className="text-[9px] font-bold text-[#D97706] hover:underline uppercase tracking-widest"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s, i) => (
                    <button 
                      key={i}
                      onClick={() => { setQuery(s); handleSearch(s); }}
                      className="px-4 py-2 bg-gray-50 rounded-full text-xs font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-100 group transition-all"
                    >
                      <Clock size={12} className="text-gray-400 group-hover:text-[#D97706]" />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Suggestions List */}
        {!isSearching && suggestions.length > 0 && (
          <div className="divide-y divide-gray-50 border-t border-gray-100">
            {suggestions.map((s, i) => (
              <button 
                key={i}
                onClick={() => {
                  setQuery(s.label);
                  handleSearch(s.label, s.type === 'category' 
                    ? { gender: s.gender, categoryId: s.categoryId } 
                    : { type: 'product', id: s.id }
                  );
                }}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <SearchIcon size={18} className="text-gray-300 group-hover:text-[#D97706]" />
                  <span className="text-sm font-bold text-[#2D2D2D]">
                    {s.type === 'category' ? (
                      <>
                        <span className="font-normal text-gray-400">{s.label.split(' ')[0]}</span>
                        {' '}{s.label.split(' ').slice(1).join(' ')}
                      </>
                    ) : s.label}
                  </span>
                </div>
                {s.type === 'category' && (
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                    POPULAR
                    <ChevronRight size={14} />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {isSearching && (
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-8">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                {loading ? 'Searching...' : `Found ${results.length} results for "${query}"`}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                 {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-[3/4] bg-gray-50 animate-pulse rounded-sm" />)}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-12 gap-x-6">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag size={32} className="text-gray-300" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-1.5">No results found</h3>
                  <p className="text-xs text-gray-400 font-medium max-w-xs mx-auto">We couldn't find anything matching "{query}". Try checking your spelling or use more general terms.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
