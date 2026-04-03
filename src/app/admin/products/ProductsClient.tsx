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
  Package,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { uploadImage } from '@/lib/storage';
import { useRealtime } from '@/hooks/useRealtime';

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
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedGender, setSelectedGender] = useState<'men' | 'women' | 'kids' | string | null>(forcedGender || null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(forcedCategoryId || null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  // Category management states
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', gender: 'men' as 'men' | 'women' | 'kids' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const router = useRouter();

  // Real-Time Sync: Refetch when products or categories change
  useRealtime('products', () => {
    fetchProducts();
  });
  useRealtime('categories', () => {
    fetchCategories();
  });

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

  async function fetchCategories() {
    try {
      const { data, error } = await adminSupabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCategories(data || []);
      router.refresh();
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  async function handleAddCategory() {
    if (!newCategory.name || !selectedFile) return;
    setSaving(true);

    const targetGender = selectedGender || newCategory.gender;
    
    try {
      const imageUrl = await uploadImage(selectedFile!, 'categories');
      const { error } = await adminSupabase
        .from('categories')
        .insert([{
          name: newCategory.name,
          gender: targetGender,
          image_url: imageUrl
        }]);
      
      if (error) throw error;
      
      setNewCategory({ name: '', gender: 'men' });
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsAddingCategory(false);
      fetchCategories();
    } catch (err: any) {
      alert(`Error adding category: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateCategory() {
    if (!editingCategory || !editingCategory.name) return;
    setSaving(true);

    try {
      let imageUrl = editingCategory.image_url;
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile, 'categories');
      }

      const { error } = await adminSupabase
        .from('categories')
        .update({
          name: editingCategory.name,
          gender: editingCategory.gender,
          image_url: imageUrl
        })
        .match({ id: editingCategory.id });
      
      if (error) throw error;
      
      setEditingCategory(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchCategories();
    } catch (err: any) {
      alert(`Error updating category: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('Are you sure you want to delete this category? All products in this category will become unreachable through hierarchy. Proceed?')) return;
    try {
      const { error } = await adminSupabase
        .from('categories')
        .delete()
        .match({ id });
      
      if (error) throw error;
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
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
            {!selectedCategoryId ? (
              <button 
                onClick={() => setIsAddingCategory(!isAddingCategory)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95"
              >
                {isAddingCategory ? <X size={18} /> : <Plus size={18} />}
                {isAddingCategory ? 'Cancel' : 'Add Category'}
              </button>
            ) : (
              <Link 
                href={`/admin/products/add?gender=${selectedGender}${selectedCategoryId ? `&category_id=${selectedCategoryId}` : ''}`}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95"
              >
                <Plus size={18} />
                Add Product
              </Link>
            )}
          </div>
        )}
      </div>

      {!selectedGender ? (
        /* STAGE 1: GENDER SELECTION */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {(['men', 'women', 'kids'] as const).map((gender) => {
            const count = products.filter(p => p.gender === gender).length;
            return (
              <div key={gender} className="group block">
                <button 
                  onClick={() => router.push(`/admin/products/${gender}`)}
                  className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl cursor-pointer bg-white shadow-xl shadow-black/5 hover:shadow-black/15 transition-all duration-700 active:scale-95 mb-4"
                >
                  <img 
                    src={getHeroImage(gender)} 
                    alt={gender} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
                </button>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-[0.2em] transition-colors group-hover:text-[#D97706]">
                    {gender} Collection
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{count} Pieces</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : !selectedCategoryId ? (
        /* STAGE 2: CATEGORY SELECTION */
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {/* Add Category Form */}
           {isAddingCategory && (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl">
              <h3 className="font-bold text-lg mb-6 tracking-tight">Create New <span className="text-[#D97706] italic uppercase">{selectedGender}'s</span> Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Linen Essentials"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#D97706] transition-all"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2 col-span-1 lg:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category Image</label>
                  <div className="relative group/upload h-32 md:h-14">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`w-full h-full border-2 border-dashed rounded-xl flex items-center px-4 transition-all ${
                      previewUrl 
                        ? 'border-[#D97706] bg-[#D97706]/5' 
                        : 'border-gray-200 bg-gray-50 group-hover/upload:border-[#D97706]'
                    }`}>
                      <Plus size={18} className={`${previewUrl ? 'text-[#D97706]' : 'text-gray-400'} mr-3`} />
                      <span className={`text-xs font-bold truncate ${previewUrl ? 'text-[#D97706]' : 'text-gray-400'}`}>
                        {selectedFile ? selectedFile.name : 'Select Image from Device'}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  disabled={saving}
                  onClick={handleAddCategory}
                  className="px-6 py-3 bg-[#D97706] text-white rounded-xl text-sm font-bold hover:bg-[#B45309] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#D97706]/20"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                  Create
                </button>
              </div>
            </div>
          )}

          {/* Edit Category Form */}
          {editingCategory && (
            <div className="bg-white p-8 rounded-2xl border border-[#D97706]/20 shadow-xl border-l-4 border-l-[#D97706]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg tracking-tight">Edit Category: <span className="text-[#D97706] italic uppercase">{editingCategory.name}</span></h3>
                <button 
                  onClick={() => {
                    setEditingCategory(null);
                    setPreviewUrl(null);
                    setSelectedFile(null);
                  }}
                  className="text-xs font-bold text-gray-400 hover:text-black flex items-center gap-1 uppercase tracking-widest"
                >
                  <X size={14} /> Close
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#D97706] transition-all"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2 col-span-1 lg:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Update Image (Optional)</label>
                  <div className="relative group/upload h-32 md:h-14">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`w-full h-full border-2 border-dashed rounded-xl flex items-center px-4 transition-all ${
                      previewUrl 
                        ? 'border-[#D97706] bg-[#D97706]/5' 
                        : 'border-gray-200 bg-gray-50 group-hover/upload:border-[#D97706]'
                    }`}>
                      <Plus size={18} className={`${previewUrl ? 'text-[#D97706]' : 'text-gray-400'} mr-3`} />
                      <span className={`text-xs font-bold truncate ${previewUrl ? 'text-[#D97706]' : 'text-gray-400'}`}>
                        {selectedFile ? selectedFile.name : 'Change Category Image'}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  disabled={saving}
                  onClick={handleUpdateCategory}
                  className="px-6 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-[#D97706] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Edit2 size={18} />}
                  Update Category
                </button>
              </div>
            </div>
          )}

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {categories.filter(c => c.gender === selectedGender).map((cat) => {
                const productCount = products.filter(p => p.category_id === cat.id).length;
                return (
                  <div 
                    key={cat.id}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 mb-4">
                      <img 
                        src={cat.image_url} 
                        alt={cat.name} 
                        onClick={() => router.push(`/admin/products/${selectedGender}/${cat.name}`)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Action Overlay */}
                      <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCategory(cat);
                            setPreviewUrl(cat.image_url);
                            setIsAddingCategory(false);
                          }}
                          className="p-2 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white hover:text-black transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(cat.id);
                          }}
                          className="p-2 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div 
                        onClick={() => router.push(`/admin/products/${selectedGender}/${cat.name}`)}
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] transition-colors group-hover:text-[#D97706]">
                        {cat.name}
                      </h3>
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest leading-none">
                        {productCount} items
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {categories.filter(c => c.gender === selectedGender).length === 0 && (
                <div className="col-span-full py-32 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
                   <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">No categories found for {selectedGender}</p>
                   <button 
                     onClick={() => setIsAddingCategory(true)}
                     className="px-8 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#D97706] transition-colors"
                   >
                     Create First Category
                   </button>
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
