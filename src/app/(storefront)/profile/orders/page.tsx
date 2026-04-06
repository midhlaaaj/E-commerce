'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { OrdersSkeleton } from '@/components/profile/ProfileSkeleton';
import { useProfileStore } from '@/store/use-profile-store';

export default function OrdersPage() {
  const { user, profileLoading } = useAuth();
  const { orders, hasLoadedOrders, setOrders } = useProfileStore();
  const [localLoading, setLocalLoading] = useState(!hasLoadedOrders);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!user) return;
    if (!silent) setLocalLoading(true);

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          status,
          total_amount,
          order_items (
            id,
            product_name,
            product_image,
            quantity,
            price,
            size,
            color
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLocalLoading(false);
    }
  }, [user, setOrders]);

  useEffect(() => {
    fetchOrders(hasLoadedOrders);
  }, [fetchOrders, hasLoadedOrders]);

  if ((profileLoading || localLoading) && !hasLoadedOrders) {
    return <OrdersSkeleton />;
  }

  return (
    <div className="animate-in fade-in duration-700 pb-20">

      {orders.length === 0 ? (
        <div className="p-20 rounded-3xl bg-gray-50/50 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md mb-8">
            <ShoppingBag size={24} className="text-[#8C5E45]" />
          </div>
          <h3 className="text-[14px] font-black uppercase tracking-widest text-[#2D2D2D] mb-4">No orders yet</h3>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-12 max-w-xs mx-auto leading-relaxed">
            You haven't placed any orders yet. When you do, they will appear here.
          </p>
          <Link 
            href="/all"
            className="px-10 py-5 bg-[#2D2D2D] text-white hover:bg-black text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-lg shadow-black/5 active:scale-95 flex items-center gap-4"
          >
            Start Shopping
            <ChevronRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:border-gray-300 hover:shadow-xl hover:shadow-black/5 transition-all group"
            >
              {/* Order Header */}
              <div className="bg-gray-50/50 px-8 py-6 flex flex-wrap items-center justify-between gap-6 border-b border-gray-100">
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">DATE PLACED</p>
                    <p className="text-[10px] font-black text-black uppercase">
                      {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px) font-black uppercase tracking-widest text-gray-400 mb-1">TOTAL AMOUNT</p>
                    <p className="text-[10px] font-black text-black">₹{order.total_amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">STATUS</p>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-100 animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-green-600">{order.status}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">#{order.id.slice(0, 8)}</span>
                  <button className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-black">
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-8 space-y-8">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex gap-8 group/item">
                    <div className="relative w-24 h-32 bg-gray-50 flex-shrink-0 overflow-hidden rounded-xl border border-transparent group-hover/item:border-gray-200 transition-all">
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover/item:scale-110"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="text-[11px] font-black uppercase tracking-wider text-[#2D2D2D] leading-relaxed max-w-md">
                            {item.product_name}
                          </h4>
                          <p className="text-[11px] font-black text-black">₹{item.price.toLocaleString()}</p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-4 items-center">
                          <div className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-sm flex items-center gap-2">
                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">SIZE</span>
                            <span className="text-[9px] font-black uppercase text-black">{item.size}</span>
                          </div>
                          {item.color && (
                            <div className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-sm flex items-center gap-2">
                              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">COLOR</span>
                              <span className="text-[9px] font-black uppercase text-black">{item.color}</span>
                            </div>
                          )}
                          <div className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-sm flex items-center gap-2">
                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">QUANTITY</span>
                            <span className="text-[9px] font-black uppercase text-black">{item.quantity}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Link 
                          href="/all"
                          className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D97706] hover:underline"
                        >
                          Buy it again
                        </Link>
                        <span className="text-gray-100 italic">|</span>
                        <Link 
                          href="/all"
                          className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black"
                        >
                          View Product
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
