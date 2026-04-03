'use client';

import { useState } from 'react';
import { adminSupabase } from '@/lib/supabase';
import { 
  ShoppingBag, 
  Tag, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Plus,
  RefreshCw,
  MoreVertical,
  Package,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface DashboardProps {
  initialStats: {
    name: string;
    value: string;
    iconId: string;
    change: string;
    changeType: string;
  }[];
}

const ICON_MAP: Record<string, any> = {
  products: ShoppingBag,
  categories: Tag,
  visits: Users,
  revenue: TrendingUp
};

export default function DashboardClient({ initialStats }: DashboardProps) {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [{ count: productCount }, { count: categoryCount }, { data: ordersData }] = await Promise.all([
        adminSupabase.from('products').select('*', { count: 'exact', head: true }),
        adminSupabase.from('categories').select('*', { count: 'exact', head: true }),
        adminSupabase.from('orders').select('total_amount'),
      ]);

      const totalRevenue = ordersData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      const newStats = [
        { ...stats[0], value: (productCount || 0).toString(), change: `+${productCount || 0}`, changeType: productCount ? 'increase' : 'neutral' },
        { ...stats[1], value: (categoryCount || 0).toString(), change: `+${categoryCount || 0}`, changeType: 'neutral' },
        { ...stats[2], value: `₹${totalRevenue.toFixed(2)}`, change: `+₹${totalRevenue.toFixed(2)}`, changeType: totalRevenue > 0 ? 'increase' : 'neutral' },
        stats[3],
      ];
      setStats(newStats);
      router.refresh();
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your store metrics and recent activity.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white hover:bg-black rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add Product
          </Link>
          <button 
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-sm"
          >
            {loading ? <Loader2 className="animate-spin text-gray-400" size={16} /> : <RefreshCw size={16} className="text-gray-500" />}
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => {
          const Icon = ICON_MAP[stat.iconId] || ShoppingBag;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600">
                  <Icon size={18} />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md",
                  stat.changeType === 'increase' ? "text-emerald-700 bg-emerald-50" :
                  stat.changeType === 'decrease' ? "text-red-700 bg-red-50" :
                  "text-gray-600 bg-gray-100"
                )}>
                  {stat.changeType === 'increase' && <ArrowUpRight size={14} />}
                  {stat.changeType === 'decrease' && <ArrowDownRight size={14} />}
                  {stat.change}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.name}</p>
                <p className="text-3xl font-semibold text-gray-900">
                  {loading ? (
                    <span className="animate-pulse bg-gray-200 h-8 w-24 block rounded-md"></span>
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart / Activity Area */}
        <div className="bg-white lg:col-span-2 rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
          
          <div className="flex-1 p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-4">
              <ShoppingBag size={28} />
            </div>
            <p className="text-sm font-medium text-gray-900">No recent orders</p>
            <p className="text-sm text-gray-500 mt-1 max-w-[250px]">When a customer places an order, it will appear here.</p>
          </div>
        </div>

        {/* Quick Links Area */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">Quick Actions</h3>
          </div>
          
          <div className="p-4 space-y-2">
            <Link 
              href="/admin/products"
              className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
            >
               <div className="w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center flex-shrink-0">
                 <Package size={18} />
               </div>
               <div>
                 <p className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors">Manage Products</p>
                 <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">Add, edit, or remove store items</p>
               </div>
            </Link>

            <Link 
              href="/admin/homepage"
              className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
            >
               <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-200 transition-all">
                 <Home size={18} />
               </div>
               <div>
                 <p className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors">Edit Homepage</p>
                 <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">Update banners and featured collections</p>
               </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
