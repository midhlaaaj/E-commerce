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

interface CategoriesClientProps {
  initialCategories: Category[];
}

export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', gender: 'men' as 'men' | 'women' | 'kids' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const router = useRouter();

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
    try {
      const imageUrl = await uploadImage(selectedFile, 'categories');
      const { error } = await adminSupabase
        .from('categories')
        .insert([{
          ...newCategory,
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading tracking-tighter italic">Manage Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage categories for Men, Women, and Kids.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 active:scale-95"
        >
          {isAdding ? <Trash2 size={18} /> : <Plus size={18} />}
          {isAdding ? 'Cancel' : 'New Category'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="font-bold text-lg mb-6 tracking-tight">Create New Category</h3>
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
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Gender</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#D97706] transition-all"
                value={newCategory.gender}
                onChange={(e) => setNewCategory({...newCategory, gender: e.target.value as any})}
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
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
              className="px-6 py-3 bg-[#D97706] text-white rounded-xl text-sm font-bold hover:bg-[#B45309] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
              Create
            </button>
          </div>
        </div>
      )}

      {editingCategory && (
        <div className="bg-white p-8 rounded-2xl border border-[#D97706]/20 shadow-xl animate-in fade-in slide-in-from-top-4 duration-500 border-l-4 border-l-[#D97706]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg tracking-tight">Edit Category: <span className="text-[#D97706] italic">{editingCategory.name}</span></h3>
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
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Gender</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#D97706] transition-all"
                value={editingCategory.gender}
                onChange={(e) => setEditingCategory({...editingCategory, gender: e.target.value as any})}
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
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
        {categories.map((cat) => (
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
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/20">
                  {cat.gender}
                </span>
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
        
        {categories.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-gray-50 rounded-full text-gray-300 mb-4 font-heading italic text-3xl font-bold uppercase">EMPTY</div>
            <h3 className="font-bold text-gray-800">No categories found</h3>
            <p className="text-sm text-gray-500 mt-1">Start by adding your first category above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
