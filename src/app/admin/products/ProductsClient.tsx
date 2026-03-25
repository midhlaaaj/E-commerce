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
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const router = useRouter();

  async function fetchProducts() {
    setLoading(true);
    try {
      let query = adminSupabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (genderFilter !== 'all') {
        query = query.eq('gender', genderFilter);
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

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (genderFilter === 'all' || p.gender === genderFilter)
  );

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading tracking-tighter italic">Products Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your collection, prices, and visibility.</p>
        </div>
        <Link 
          href="/admin/products/add"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#D97706] text-white rounded-xl text-sm font-bold hover:bg-[#B45309] transition-all shadow-lg shadow-orange-900/10 active:scale-95"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#D97706] transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'men', 'women', 'kids'].map((g) => (
            <button
              key={g}
              onClick={() => setGenderFilter(g)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                genderFilter === g 
                  ? 'bg-black text-white shadow-md' 
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gender</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Loader2 className="animate-spin text-[#D97706] mx-auto" size={32} />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-400 font-semibold italic">
                    No products found.
                  </td>
                </tr>
              ) : filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Plus size={16} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-[#D97706] transition-colors">{p.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Stock: {p.stock}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                      Category ID: {p.category_id.slice(0, 8)}...
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {p.offer_price ? (
                      <div className="flex flex-col gap-1 items-start">
                        <span className="text-[10px] font-bold text-gray-400 line-through bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                          ₹{p.price}
                        </span>
                        <span className="text-sm font-bold text-[#D97706] bg-orange-50 px-2 py-0.5 rounded-md font-heading border border-orange-100">
                          ₹{p.offer_price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-gray-900 font-heading">
                        ₹{p.price}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">
                      {p.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleStatus(p.id, 'is_featured', p.is_featured)}
                        className={`p-2 rounded-lg transition-all ${
                          p.is_featured ? 'bg-yellow-50 text-yellow-500 shadow-sm' : 'bg-gray-50 text-gray-300 hover:text-yellow-500'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star size={16} fill={p.is_featured ? 'currentColor' : 'none'} />
                      </button>
                      <button 
                        onClick={() => toggleStatus(p.id, 'is_sale', p.is_sale)}
                        className={`p-2 rounded-lg transition-all ${
                          p.is_sale ? 'bg-orange-50 text-[#D97706] shadow-sm' : 'bg-gray-50 text-gray-300 hover:text-[#D97706]'
                        }`}
                        title="Toggle Sale"
                      >
                        <TagIcon size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/admin/products/edit/${p.id}`}
                        className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100 inline-block"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100"
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
        
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Showing {filteredProducts.length} results
          </p>
          <div className="flex gap-2">
            <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-black transition-colors disabled:opacity-50" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-black transition-colors disabled:opacity-50" disabled>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
