'use client';

import { useState } from 'react';
import { adminSupabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/storage';
import { Plus, Trash2, Edit2, Loader2, Image as ImageIcon, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  image_url: string;
  gender: 'men' | 'women' | 'kids';
}

interface HeroRecord {
  section_key: string;
  image_url: string;
}

interface CategoriesClientProps {
  initialCategories: Category[];
  initialHeros: HeroRecord[];
  forcedGender?: 'men' | 'women' | 'kids' | null;
}

export default function CategoriesClient({ initialCategories, initialHeros, forcedGender }: CategoriesClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedGender, setSelectedGender] = useState<'men' | 'women' | 'kids' | null>(forcedGender || null);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', gender: 'men' as 'men' | 'women' | 'kids' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const router = useRouter();

  // Helper to get hero image from section_key
  const getHeroImage = (gender: string) => {
    return initialHeros.find(h => h.section_key === `${gender}_hero`)?.image_url || '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

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

  async function handleAddCategory() {
    if (!newCategory.name || !selectedFile) return;
    setSaving(true);

    const targetGender = selectedGender || newCategory.gender;
    
    // Check for duplicates locally first
    const isDuplicate = categories.some(
      c => c.name.toLowerCase() === newCategory.name.toLowerCase() && c.gender === targetGender
    );

    if (isDuplicate) {
      alert(`A category named "${newCategory.name}" already exists for ${targetGender}. Please use a unique name for this collection.`);
      setSaving(false);
      return;
    }

    try {
      const imageUrl = await uploadImage(selectedFile!, 'categories');
      const { error } = await adminSupabase
        .from('categories')
        .insert([{
          ...newCategory,
          gender: targetGender,
          image_url: imageUrl
        }]);
      
      if (error) throw error;
      
      setNewCategory({ name: '', gender: 'men' });
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsAdding(false);
      fetchCategories();
    } catch (err: any) {
      alert(`Error adding category: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('Are you sure you want to delete this category?')) return;
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

  async function handleUpdateCategory() {
    if (!editingCategory || !editingCategory.name) return;
    setSaving(true);

    // Check for duplicates locally first (excluding the current category being edited)
    const isDuplicate = categories.some(
      c => c.id !== editingCategory.id && 
           c.name.toLowerCase() === editingCategory.name.toLowerCase() && 
           c.gender === editingCategory.gender
    );

    if (isDuplicate) {
      alert(`A category named "${editingCategory.name}" already exists for ${editingCategory.gender}. Please use a unique name.`);
      setSaving(false);
      return;
    }

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

  // Final category list for display (filtered if gender is chosen)
  const displayCategories = selectedGender 
    ? categories.filter(c => c.gender === selectedGender)
    : categories;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-1">
             <h1 className="text-2xl font-bold text-gray-900 font-heading tracking-tighter italic uppercase">
               {selectedGender ? `${selectedGender}'s Categories` : 'Manage Categories'}
             </h1>
             {selectedGender && (
               <button 
                 onClick={() => {
                   if (forcedGender) {
                     router.push('/admin/categories');
                   } else {
                     setSelectedGender(null);
                     setIsAdding(false);
                     setEditingCategory(null);
                   }
                 }}
                 className="text-[10px] bg-gray-100 px-3 py-1 rounded-full font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
               >
                 Change Gender
               </button>
             )}
          </div>
          <p className="text-sm text-gray-500">
            {selectedGender 
              ? `Manage and create specific categories for the ${selectedGender}'s collection.` 
              : 'Choose a gender category to begin managing your selection.'
            }
          </p>
        </div>
        
        {selectedGender && (
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 active:scale-95"
          >
            {isAdding ? <Trash2 size={18} /> : <Plus size={18} />}
            {isAdding ? 'Cancel' : 'New Category'}
          </button>
        )}
      </div>

      {!selectedGender ? (
        /* GENDER CHOICE VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {(['men', 'women', 'kids'] as const).map((gender) => {
            const count = categories.filter(c => c.gender === gender).length;
            return (
              <button 
                key={gender}
                onClick={() => router.push(`/admin/categories/${gender}`)}
                className="group relative h-[500px] overflow-hidden rounded-3xl cursor-pointer text-left bg-gray-50 bg-white shadow-xl shadow-black/5 hover:shadow-black/15 transition-all duration-700 active:scale-95"
              >
                <img 
                  src={getHeroImage(gender)} 
                  alt={gender} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-10 text-white">
                  <span className="text-[10px] font-bold text-[#D97706] tracking-[0.4em] uppercase mb-2 block">SELECT GENDER</span>
                  <h2 className="text-4xl font-extrabold tracking-tighter uppercase mb-4">{gender}</h2>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                      <span className="font-bold">{count}</span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-white/60">Categories Configured</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        /* CATEGORY MANAGEMENT VIEW */
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {isAdding && (
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
                {/* Gender hidden as it's pre-selected */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayCategories.map((cat) => (
              <div key={cat.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img 
                    src={cat.image_url} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <button 
                      onClick={() => {
                        setEditingCategory(cat);
                        setPreviewUrl(cat.image_url);
                        setIsAdding(false);
                      }}
                      className="p-2 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white hover:text-black transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-2 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-lg tracking-tight uppercase group-hover:text-[#D97706] transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
                    <ImageIcon size={14} />
                    <span>Configured</span>
                  </div>
                </div>
              </div>
            ))}
            
            {displayCategories.length === 0 && (
              <div className="col-span-full py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-gray-50 rounded-full text-gray-300 mb-4 font-heading italic text-3xl font-bold uppercase">EMPTY</div>
                <h3 className="font-bold text-gray-800">No categories found for {selectedGender}</h3>
                <p className="text-sm text-gray-500 mt-1">Start by adding your first category above.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
