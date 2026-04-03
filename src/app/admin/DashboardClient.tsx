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
    <div className="space-y-16 animate-in fade-in duration-1000 fill-mode-both">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-gray-100">
        <div className="space-y-4">
          <p className="text-[9px] font-black text-black/30 uppercase tracking-[0.5em] ml-1">Archive Summary / Q2 2024</p>
          <div className="flex flex-col leading-[0.85]">
            <h1 className="text-[56px] font-thin tracking-tighter uppercase text-black">Control</h1>
            <h1 className="text-[56px] font-black tracking-tighter uppercase text-black -mt-1 italic">Dashboard</h1>
          </div>
        </div>
        
        <button 
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-3 px-8 py-4 bg-black text-white text-[9px] font-black uppercase tracking-[0.4em] hover:bg-gray-900 transition-all active:scale-[0.98] group disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />}
          {loading ? 'SYNCHRONIZING' : 'REFRESH METRICS'}
        </button>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 border border-gray-100">
        {stats.map((stat, idx) => {
          const Icon = ICON_MAP[stat.iconId] || ShoppingBag;
          return (
            <div key={stat.name} className="bg-white p-10 space-y-8 group hover:bg-[#fcfcfc] transition-colors duration-500">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 bg-black flex items-center justify-center text-white transition-transform group-hover:scale-110">
                  <Icon size={16} />
                </div>
                <div className={cn(
                  "text-[8px] font-black uppercase tracking-widest px-3 py-1 border",
                  stat.changeType === 'increase' ? "text-green-600 border-green-600/20 bg-green-50" :
                  stat.changeType === 'decrease' ? "text-red-600 border-red-600/20 bg-red-50" :
                  "text-black/30 border-black/5 bg-gray-50"
                )}>
                  {stat.change}
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-[9px] font-black text-black/30 uppercase tracking-[0.3em]">{stat.name}</p>
                <p className="text-[42px] font-black text-black leading-none tracking-tighter">
                  {loading ? '---' : stat.value}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-700">
                <span className="text-[7px] font-black tracking-[0.4em] uppercase text-black/20">Operational Clear</span>
                <ArrowUpRight size={12} className="text-black/20" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Information Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-gray-100 border border-gray-100">
        {/* Activity Log */}
        <div className="bg-white p-12 lg:col-span-2 flex flex-col justify-between min-h-[400px]">
          <div className="space-y-2">
             <p className="text-[9px] font-black text-black/30 uppercase tracking-[0.5em]">Real-time Event Stream</p>
             <h3 className="text-2xl font-black tracking-tighter uppercase italic">Operational Log</h3>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center space-y-6 opacity-20">
             <div className="w-px h-16 bg-black" />
             <p className="text-[10px] font-black uppercase tracking-[0.8em]">No Events Recorded</p>
             <div className="w-px h-16 bg-black" />
          </div>

          <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
            <span className="text-[8px] font-black uppercase tracking-widest text-black/10">Archive Monitor v0.4</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-black rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-black rounded-full animate-pulse delay-75" />
              <div className="w-1 h-1 bg-black rounded-full animate-pulse delay-150" />
            </div>
          </div>
        </div>

        {/* Rapid Deployment Shell */}
        <div className="bg-[#fcfcfc] p-12 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-2">
               <p className="text-[9px] font-black text-black/30 uppercase tracking-[0.5em]">Quick Procedures</p>
               <h3 className="text-2xl font-black tracking-tighter uppercase italic">Direct Access</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4 pt-4">
              <Link 
                href="/admin/products"
                className="flex items-center justify-between p-8 bg-black text-white hover:bg-gray-900 transition-all group overflow-hidden relative active:scale-[0.98]"
              >
                <div className="flex flex-col gap-1 relative z-10">
                   <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40">System A</span>
                   <span className="text-[10px] font-black uppercase tracking-[0.4em]">DEPLOY PRODUCT</span>
                </div>
                <Plus size={20} className="relative z-10 transition-transform group-hover:rotate-90 duration-500" />
                <div className="absolute inset-0 bg-white/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
              </Link>

              <Link 
                href="/admin/homepage"
                className="flex items-center justify-between p-8 border border-black/10 bg-white text-black hover:bg-black hover:text-white transition-all group active:scale-[0.98]"
              >
                <div className="flex flex-col gap-1">
                   <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40">System B</span>
                   <span className="text-[10px] font-black uppercase tracking-[0.4em]">EDITORIAL SYNC</span>
                </div>
                <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-700" />
              </Link>
            </div>
          </div>

          <div className="pt-10 opacity-[0.05] pointer-events-none select-none">
             <h4 className="text-[40px] font-black tracking-tighter italic leading-none">TERMINAL</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
