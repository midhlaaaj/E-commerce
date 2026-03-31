'use client';

import { useState } from 'react';
import { adminSupabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Star, 
  Tag as TagIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Package
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  image_url: string;
  gender: string;
}

interface HeroRecord {
  section_key: string;
  image_url: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  offer_price: number | null;
  gender: string;
  is_featured: boolean;
  is_sale: boolean;
  stock: number;
  images: string[];
  category_id: string;
}

interface ProductsClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
  initialHeros: HeroRecord[];
  forcedGender?: 'men' | 'women' | 'kids' | string | null;
  forcedCategoryId?: string | null;
}

export default function ProductsClient({ 
  initialProducts, 
  initialCategories, 
  initialHeros, 
  forcedGender,
  forcedCategoryId 
}: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories] = useState<Category[]>(initialCategories);
  const [selectedGender, setSelectedGender] = useState<'men' | 'women' | 'kids' | string | null>(forcedGender || null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(forcedCategoryId || null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  async function fetchProducts() {
    setLoading(true);
    try {
      let query = adminSupabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (selectedGender) {
        query = query.eq('gender', selectedGender);
      }
      if (selectedCategoryId) {
        query = query.eq('category_id', selectedCategoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
      router.refresh();
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }

  // Filter products based on search and hierarchy
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesGender = !selectedGender || p.gender === selectedGender;
    const matchesCategory = !selectedCategoryId || p.category_id === selectedCategoryId;
    return matchesSearch && matchesGender && matchesCategory;
  });

  const getHeroImage = (gender: string) => {
    return initialHeros.find(h => h.section_key === `${gender}_hero`)?.image_url || '';
  };

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || 'Unknown Category';
  };

  async function toggleStatus(id: string, field: 'is_featured' | 'is_sale', current: boolean) {
    try {
      const { error } = await adminSupabase
        .from('products')
        .update({ [field]: !current })
        .match({ id });
      
      if (error) throw error;
      fetchProducts();
    } catch (err) {
      console.error(`Error toggling ${field}:`, err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await adminSupabase
        .from('products')
        .delete()
        .match({ id });
      
      if (error) throw error;
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  }

  return (
    <div className="space-y-8">
      {/* Dynamic Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-gray-100">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
             <button 
               onClick={() => { 
                 if (forcedGender) router.push('/admin/products');
                 else { setSelectedGender(null); setSelectedCategoryId(null); }
               }}
               className={`transition-colors ${!selectedGender ? 'text-black' : 'text-gray-400 hover:text-black'}`}
             >
               All Collections
             </button>
             {selectedGender && (
               <>
                 <ChevronRight size={12} className="text-gray-300" />
                 <button 
                   onClick={() => {
                     if (forcedGender && !selectedCategoryId) router.push('/admin/products');
                     else if (forcedCategoryId) router.push(`/admin/products/${selectedGender}`);
                     else setSelectedCategoryId(null);
                   }}
                   className={`transition-colors ${!selectedCategoryId ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                 >
                   {selectedGender}
                 </button>
               </>
             )}
             {selectedCategoryId && (
               <>
                 <ChevronRight size={12} className="text-gray-300" />
                 <span className="text-black">{getCategoryName(selectedCategoryId)}</span>
               </>
             )}
          </nav>

          <h1 className="text-2xl font-bold text-gray-900 font-heading tracking-tighter italic uppercase">
            {selectedCategoryId 
              ? getCategoryName(selectedCategoryId)
              : selectedGender 
                ? `${selectedGender}'s Categories`
                : 'Inventory Management'
            }
          </h1>
          <p className="text-sm text-gray-500 mt-1">
             {selectedCategoryId 
               ? `Managing products within ${getCategoryName(selectedCategoryId)} collection.`
               : selectedGender 
                 ? `Select a category from the ${selectedGender}'s collection.`
                 : 'Choose a gender collection to begin managing your inventory.'
             }
          </p>
        </div>
        
        {/* Actions - Only visible at Category or Product level */}
        {selectedGender && (
          <div className="flex items-center gap-4">
             <Link 
              href={`/admin/products/add?gender=${selectedGender}${selectedCategoryId ? `&category_id=${selectedCategoryId}` : ''}`}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95"
            >
              <Plus size={18} />
              Add Product
            </Link>
          </div>
        )}
      </div>

      {!selectedGender ? (
        /* STAGE 1: GENDER SELECTION */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(['men', 'women', 'kids'] as const).map((gender) => {
            const count = products.filter(p => p.gender === gender).length;
            return (
              <button 
                key={gender}
                onClick={() => router.push(`/admin/products/${gender}`)}
                className="group relative h-[500px] overflow-hidden rounded-3xl cursor-pointer text-left bg-white shadow-xl shadow-black/5 hover:shadow-black/15 transition-all duration-700 active:scale-95"
              >
                <img 
                  src={getHeroImage(gender)} 
                  alt={gender} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-[0.8]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-10 text-white">
                  <span className="text-[10px] font-bold text-[#D97706] tracking-[0.4em] uppercase mb-2 block">MANAGE COLLECTION</span>
                  <h2 className="text-4xl font-extrabold tracking-tighter uppercase mb-4">{gender}</h2>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                      <span className="font-bold">{count}</span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-white/50">Total Pieces</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      ) : !selectedCategoryId ? (
        /* STAGE 2: CATEGORY SELECTION */
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.filter(c => c.gender === selectedGender).map((cat) => {
                const productCount = products.filter(p => p.category_id === cat.id).length;
                return (
                  <button 
                    key={cat.id}
                    onClick={() => router.push(`/admin/products/${selectedGender}/${cat.name}`)}
                    className="group relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                  >
                    <img 
                      src={cat.image_url} 
                      alt={cat.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white text-left">
                      <h3 className="text-xl font-bold uppercase tracking-tighter mb-1">{cat.name}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">{productCount} Products</p>
                    </div>
                    <div className="absolute top-4 right-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                       <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                          <ChevronRight size={16} />
                       </div>
                    </div>
                  </button>
                )
              })}
              
              {categories.filter(c => c.gender === selectedGender).length === 0 && (
                <div className="col-span-full py-32 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
                   <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">No categories found for {selectedGender}</p>
                   <Link 
                     href="/admin/categories"
                     className="px-8 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#D97706] transition-colors"
                   >
                     Manage Categories First
                   </Link>
                </div>
              )}
           </div>
        </div>
      ) : (
        /* STAGE 3: PRODUCT INVENTORY TABLE */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder={`Search ${getCategoryName(selectedCategoryId)}...`}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#D97706] transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
               onClick={() => { setSearch(''); }}
               className="px-6 py-3 text-gray-400 hover:text-black text-xs font-bold uppercase tracking-widest transition-colors"
            >
              Clear
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Info</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pricing</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Flags</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <Loader2 className="animate-spin text-black mx-auto" size={32} />
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-32 text-center">
                        <div className="max-w-xs mx-auto text-center space-y-4">
                           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                             <Package size={24} />
                           </div>
                           <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No matching products</p>
                           <button 
                             onClick={() => setSearch('')}
                             className="text-black text-xs font-bold underline"
                           >
                             Reset Search
                           </button>
                        </div>
                      </td>
                    </tr>
                  ) : filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-50">
                            {p.images?.[0] ? (
                              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Plus size={16} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 group-hover:text-[#D97706] transition-colors uppercase tracking-tight">{p.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID: {p.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {p.offer_price ? (
                          <div className="flex flex-col gap-1 items-start">
                            <span className="text-[10px] font-bold text-gray-400 line-through bg-gray-50 px-2 py-0.5 rounded-md">
                              ₹{p.price}
                            </span>
                            <span className="text-sm font-black text-black bg-orange-50 px-2 py-0.5 rounded-md font-heading border border-orange-100/50">
                              ₹{p.offer_price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-black text-black font-heading px-2 py-1 bg-gray-50 rounded-md">
                            ₹{p.price}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${p.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                           <span className={`text-[10px] font-black uppercase tracking-widest ${p.stock > 0 ? 'text-gray-900' : 'text-red-500'}`}>
                             {p.stock > 0 ? `${p.stock} Units` : 'Out of Stock'}
                           </span>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => toggleStatus(p.id, 'is_featured', p.is_featured)}
                            className={`p-2.5 rounded-xl transition-all ${
                              p.is_featured ? 'bg-yellow-50 text-yellow-500 shadow-sm border border-yellow-100' : 'bg-gray-50 text-gray-300 hover:text-yellow-500'
                            }`}
                          >
                            <Star size={16} fill={p.is_featured ? 'currentColor' : 'none'} />
                          </button>
                          <button 
                            onClick={() => toggleStatus(p.id, 'is_sale', p.is_sale)}
                            className={`p-2.5 rounded-xl transition-all ${
                              p.is_sale ? 'bg-orange-50 text-[#D97706] shadow-sm border border-orange-100' : 'bg-gray-50 text-gray-300 hover:text-[#D97706]'
                            }`}
                          >
                            <TagIcon size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                          <Link 
                            href={`/admin/products/edit/${p.id}`}
                            className="p-2.5 bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-black rounded-xl transition-all hover:shadow-md"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="p-2.5 bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-red-500 rounded-xl transition-all hover:shadow-md"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Inventory: {filteredProducts.length} Results in {getCategoryName(selectedCategoryId)}
              </p>
              <div className="flex gap-2">
                <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-black transition-colors disabled:opacity-30" disabled>
                  <ChevronLeft size={16} />
                </button>
                <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-black transition-colors disabled:opacity-30" disabled>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
