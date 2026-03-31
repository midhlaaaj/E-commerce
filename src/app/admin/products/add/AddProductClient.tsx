'use client';

import { useState, useEffect } from 'react';
import { adminSupabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/storage';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Plus, 
  Trash2, 
  Loader2, 
  Image as ImageIcon, 
  ChevronLeft,
  X,
  Upload,
  Check,
  Search
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  gender: string;
}

interface ProductImage {
  file: File;
  preview: string;
}

interface AddProductClientProps {
  initialCategories: Category[];
}

export default function AddProductClient({ initialCategories }: AddProductClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const genderParam = searchParams.get('gender');
  const categoryParam = searchParams.get('category_id');

  const [loading, setLoading] = useState(false);
  const [categories] = useState<Category[]>(initialCategories);
  const [selectedGender, setSelectedGender] = useState(genderParam || 'men');
  
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    offer_price: '',
    category_id: categoryParam || '',
    gender: genderParam || 'men',
    stock: '',
    is_featured: false,
    is_sale: false,
    colors: [] as string[],
  });

  const PREDEFINED_COLORS = [
    'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 
    'Grey', 'Beige', 'Brown', 'Pink', 'Navy', 'Purple', 'Orange'
  ];
  const [colorSearch, setColorSearch] = useState('');

  const [images, setImages] = useState<ProductImage[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [newSize, setNewSize] = useState('');

  // Local filtering of categories based on gender
  const filteredCategories = categories.filter(c => c.gender === selectedGender);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);

  // 1. Restore Draft on Mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('elitewear_product_draft');
    if (savedDraft) {
      try {
        const { product: savedProduct, sizes: savedSizes } = JSON.parse(savedDraft);
        setProduct(prev => ({ ...prev, ...savedProduct }));
        setSizes(savedSizes || []);
        console.log('Draft restored successfully.');
      } catch (e) {
        console.error('Failed to restore draft:', e);
      }
    }
  }, []);

  // 2. Persist Draft on Change
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('elitewear_product_draft', JSON.stringify({ product, sizes }));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }, 1000);
    return () => clearTimeout(timer);
  }, [product, sizes]);

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!product.name || !product.price || !product.category_id || images.length === 0) {
      setSubmitError('Please fill in all required fields and add at least one image.');
      return;
    }

    setLoading(true);
    try {
      console.log('1. Starting Image Uploads...');
      const uploadedUrls = await Promise.all(
        images.map(img => uploadImage(img.file, 'products'))
      );
      console.log('2. Image Uploads successful:', uploadedUrls);

      console.log('3. Inserting Product into Database...');
      const { error } = await adminSupabase
        .from('products')
        .insert([{
          ...product,
          price: parseFloat(product.price),
          offer_price: product.offer_price ? parseFloat(product.offer_price) : null,
          stock: parseInt(product.stock) || 0,
          gender: selectedGender,
          images: uploadedUrls,
          sizes,
          colors: product.colors,
          rating: 5.0
        }]);

      if (error) {
        console.error('Database Insertion Error:', error);
        throw error;
      }
      
      console.log('4. Success! Cleanup and Redirecting...');
      localStorage.removeItem('elitewear_product_draft');
      
      // Dynamic Redirection back to source collection
      if (selectedGender) {
        const categoryName = categories.find(c => c.id === product.category_id)?.name;
        if (categoryName) {
          window.location.href = `/admin/products/${selectedGender}/${categoryName}`;
        } else {
          window.location.href = `/admin/products/${selectedGender}`;
        }
      } else {
        window.location.href = '/admin/products';
      }
    } catch (err: any) {
      console.error('Error adding product:', err);
      setSubmitError(err.message || 'An unknown error occurred while adding the product.');
    } finally {
      setLoading(false);
    }
  }

  const removeImage = (index: number) => {
    const img = images[index];
    URL.revokeObjectURL(img.preview);
    setImages(images.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    if (direction === 'up' && index > 0) {
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    } else if (direction === 'down' && index < images.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    }
    setImages(newImages);
  };

  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize('');
    }
  };

  const removeSize = (s: string) => {
    setSizes(sizes.filter(sz => sz !== s));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-full transition-colors border border-gray-100 bg-white shadow-sm">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading tracking-tighter italic">Create Product</h1>
          <p className="text-sm text-gray-500 mt-1">Add a new elite piece to your collection.</p>
        </div>
      </div>

      <form onSubmit={handleAddProduct} className="space-y-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg border-b border-gray-50 pb-4 tracking-tight">Essential Information</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Product Name *</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Premium Silk Blazer"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#D97706] transition-all"
                value={product.name}
                onChange={(e) => setProduct({...product, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Price (₹) *</label>
                <input 
                  required
                  type="number" 
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#D97706] transition-all"
                  value={product.price}
                  onChange={(e) => setProduct({...product, price: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Offer Price (₹)</label>
                <input 
                  type="number" 
                  placeholder="Optional"
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#D97706] transition-all"
                  value={product.offer_price}
                  onChange={(e) => {
                    const val = e.target.value;
                    const isSale = val && parseFloat(val) > 0 ? true : false;
                    setProduct({...product, offer_price: val, is_sale: isSale});
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {!genderParam && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Gender Selection *</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#D97706] transition-all"
                    value={selectedGender}
                    onChange={(e) => {
                      setSelectedGender(e.target.value);
                      setProduct({...product, category_id: '', gender: e.target.value});
                    }}
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>
              )}
              {!categoryParam && (
                <div className={genderParam ? "col-span-2 space-y-2" : "space-y-2"}>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category *</label>
                  {filteredCategories.length === 0 ? (
                    <div className="w-full px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold uppercase tracking-widest text-center">
                      No Categories Found. Create one first!
                    </div>
                  ) : (
                    <select 
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#D97706] transition-all"
                      value={product.category_id}
                      onChange={(e) => setProduct({...product, category_id: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      {filteredCategories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Stock Level</label>
              <input 
                type="number" 
                placeholder="0"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#D97706] transition-all"
                value={product.stock}
                onChange={(e) => setProduct({...product, stock: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
              <textarea 
                rows={4}
                placeholder="Describe the aesthetic and material..."
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#D97706] transition-all resize-none"
                value={product.description}
                onChange={(e) => setProduct({...product, description: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-lg border-b border-gray-50 pb-4 tracking-tight flex items-center gap-2">
                <ImageIcon size={20} />
                Gallery Management
              </h3>
              
              <div className="space-y-4">
                <div className="relative group/upload h-40">
                  <input 
                    type="file" 
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full h-full border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 group-hover/upload:border-[#D97706] group-hover/upload:bg-[#D97706]/5 transition-all flex flex-col items-center justify-center gap-2">
                    <div className="p-3 bg-white rounded-full shadow-sm text-gray-400 group-hover/upload:text-[#D97706] transition-colors">
                      <Upload size={24} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Select Images from Device</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Multiple files supported</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 min-h-[200px] content-start">
                  {images.map((img, i) => (
                    <div key={i} className="group relative aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                      <img src={img.preview} alt={`Product ${i}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <div className="flex gap-2">
                          <button 
                            type="button" 
                            onClick={() => moveImage(i, 'up')}
                            className="p-1.5 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <ChevronLeft size={16} className="rotate-90" />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => moveImage(i, 'down')}
                            className="p-1.5 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <ChevronLeft size={16} className="-rotate-90" />
                          </button>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeImage(i)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {i === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black text-white text-[8px] font-bold uppercase tracking-widest rounded-full">
                          COVER
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="font-bold text-lg border-b border-gray-50 pb-4 tracking-tight">Configuration</h3>
              
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(s => (
                    <span key={s} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold uppercase tracking-widest">
                      {s}
                      <button type="button" onClick={() => removeSize(s)} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. XL"
                    className="flex-1 px-4 py-2 bg-gray-50 border-none rounded-xl text-xs focus:ring-1 focus:ring-[#D97706] transition-all"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                  />
                  <button type="button" onClick={addSize} className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold transition-colors">ADD</button>
                </div>
              </div>

              <div className="flex flex-col gap-4 py-4 border-t border-gray-50">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-gray-300 text-[#D97706] focus:ring-[#D97706]"
                    checked={product.is_featured}
                    onChange={(e) => setProduct({...product, is_featured: e.target.checked})}
                  />
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-black transition-colors">Mark as Featured</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-gray-300 text-[#D97706] focus:ring-[#D97706]"
                    checked={product.is_sale}
                    onChange={(e) => setProduct({...product, is_sale: e.target.checked})}
                  />
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-black transition-colors">Enable Sale Tag</span>
                </label>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-50">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Product Colors</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.colors.map(c => (
                    <span key={c} className="flex items-center gap-2 px-3 py-1.5 bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                      {c}
                      <button type="button" onClick={() => setProduct({...product, colors: product.colors.filter(col => col !== c)})} className="hover:text-red-600"><X size={12} /></button>
                    </span>
                  ))}
                </div>
                
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={14} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search or add custom color (e.g. Light Pink)..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-xs focus:ring-1 focus:ring-[#D97706] transition-all"
                    value={colorSearch}
                    onChange={(e) => setColorSearch(e.target.value)}
                  />
                </div>

                <div className="max-h-40 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                  {PREDEFINED_COLORS.filter(c => 
                    c.toLowerCase().includes(colorSearch.toLowerCase()) && 
                    !product.colors.includes(c)
                  ).map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setProduct({...product, colors: [...product.colors, c]});
                        setColorSearch('');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-xs font-medium text-gray-600 flex justify-between items-center group transition-colors"
                    >
                      {c}
                      <Plus size={12} className="opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                  
                  {colorSearch && !PREDEFINED_COLORS.some(c => c.toLowerCase() === colorSearch.toLowerCase()) && !product.colors.includes(colorSearch) && (
                    <button
                      type="button"
                      onClick={() => {
                        setProduct({...product, colors: [...product.colors, colorSearch]});
                        setColorSearch('');
                      }}
                      className="w-full text-left px-4 py-2 bg-[#D97706]/5 hover:bg-[#D97706]/10 rounded-lg text-xs font-bold text-[#D97706] flex justify-between items-center transition-colors border border-[#D97706]/10"
                    >
                      Add Custom: "{colorSearch}"
                      <Plus size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-8 flex flex-col items-end gap-4">
          {submitError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold w-full max-w-md text-right">
              {submitError}
            </div>
          )}
          <div className="flex items-center gap-6">
            {draftSaved && (
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">
                Draft Saved Locally
              </span>
            )}
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-3 px-10 py-4 bg-black text-white rounded-2xl text-lg font-bold hover:bg-gray-800 transition-all shadow-2xl shadow-black/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Check size={24} />}
              {loading ? 'Publishing...' : 'Publish Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
