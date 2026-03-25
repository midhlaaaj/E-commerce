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
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
      router.refresh(); // Sync with server data if any
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-black text-black tracking-tighter italic uppercase">Dashboard</h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.3em] mt-1">Real-time enterprise metrics</p>
        </div>
        <button 
          onClick={fetchStats}
          disabled={loading}
          className="p-3 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
        >
          <RefreshCw size={18} className={`${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = ICON_MAP[stat.iconId] || ShoppingBag;
          return (
            <div key={stat.name} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -mr-8 -mt-8 group-hover:bg-[#D97706]/5 transition-colors" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-gray-50 rounded-2xl text-[#D97706] group-hover:bg-[#D97706] group-hover:text-white transition-all transform group-hover:rotate-6">
                    <Icon size={24} />
                  </div>
                  <div className={`flex items-center text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${
                    stat.changeType === 'increase' ? 'bg-green-50 text-green-600' :
                    stat.changeType === 'decrease' ? 'bg-red-50 text-red-600' :
                    'bg-gray-50 text-gray-400'
                  }`}>
                    {stat.changeType === 'increase' ? <ArrowUpRight size={10} className="mr-1" /> :
                     stat.changeType === 'decrease' ? <ArrowDownRight size={10} className="mr-1" /> : null}
                    {stat.change}
                  </div>
                </div>
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">{stat.name}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-4xl font-black text-black font-heading tracking-tighter">
                    {loading ? '---' : stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-heading font-black text-xl tracking-tight italic uppercase">Recent Activity</h3>
            <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-widest">Live Updates</span>
          </div>
          <div className="space-y-8">
            <div className="text-center py-10 space-y-4">
                 <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                    <ShoppingBag size={24} />
                 </div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No recent sales detected</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 -mr-4 -mt-4 rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <TrendingUp size={120} />
          </div>
          <h3 className="font-heading font-black text-xl tracking-tight italic mb-8 uppercase">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 relative z-10">
            <Link 
              href="/admin/products"
              className="flex items-center justify-between p-6 bg-black text-white rounded-3xl hover:bg-[#D97706] transition-all group/btn active:scale-95 shadow-xl shadow-black/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Plus size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Add New Product</span>
              </div>
              <ArrowUpRight size={18} className="opacity-0 group-hover/btn:opacity-100 -translate-x-4 group-hover/btn:translate-x-0 transition-all" />
            </Link>
            <Link 
               href="/admin/homepage"
               className="flex items-center justify-between p-6 bg-gray-50 text-black rounded-3xl hover:bg-gray-100 transition-all group/btn active:scale-95 border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
                  <RefreshCw size={18} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Manage Content</span>
              </div>
              <ArrowUpRight size={18} className="opacity-0 group-hover/btn:opacity-100 -translate-x-4 group-hover/btn:translate-x-0 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
