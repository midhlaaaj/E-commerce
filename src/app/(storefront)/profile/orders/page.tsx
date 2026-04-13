'use client';

import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, ChevronRight, Truck } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import { OrdersSkeleton } from '@/components/profile/ProfileSkeleton';

export default function OrdersPage() {
  const { user, profileLoading, supabase } = useAuth();

  const { data: orders = [], isLoading: ordersLoading, error } = useQuery({
    queryKey: ['orders'],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          status,
          total_amount,
          tracking_number,
          order_items!fk_order_items_order (
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
      return data || [];
    }
  });

  if (profileLoading || (ordersLoading && !orders.length)) {
    return <OrdersSkeleton />;
  }

  return (
    <div className="animate-in fade-in duration-700 pb-20">

      {orders.length === 0 ? (
        <div className="px-6 py-16 sm:p-20 rounded-3xl bg-gray-50/50 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-md mb-8">
            <ShoppingBag size={20} className="text-[#8C5E45]" />
          </div>
          <h3 className="text-[13px] sm:text-[14px] font-black uppercase tracking-widest text-[#2D2D2D] mb-4">No orders yet</h3>
          <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-10 sm:mb-12 max-w-[240px] sm:max-w-xs mx-auto leading-relaxed">
            You haven't placed any orders yet. When you do, they will appear here.
          </p>
          <Link 
            href="/all"
            className="w-full sm:w-auto justify-center px-10 py-5 bg-[#2D2D2D] text-white hover:bg-black text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-lg shadow-black/5 active:scale-95 flex items-center gap-4"
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
              <div className="bg-gray-50/50 px-5 py-5 sm:px-8 sm:py-6 flex flex-wrap items-center justify-between gap-y-6 gap-x-8 border-b border-gray-100">
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-y-6 gap-x-12 w-full sm:w-auto">
                  <div>
                    <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">DATE PLACED</p>
                    <p className="text-[9px] sm:text-[10px] font-black text-black uppercase">
                      {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">TOTAL AMOUNT</p>
                    <p className="text-[9px] sm:text-[10px] font-black text-black">₹{order.total_amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">STATUS</p>
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 shadow-sm shadow-green-100 animate-pulse" />
                       <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-green-600">{order.status}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">ORDER ID</p>
                    <p className="text-[9px] sm:text-[10px] font-black uppercase text-gray-300">#{order.id.slice(0, 8)}</p>
                  </div>
                  {order.tracking_number && (
                    <div className="col-span-2 sm:col-auto pt-4 sm:pt-0 sm:pl-8 sm:border-l border-gray-100">
                      <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#D97706] mb-1">TRACKING NUMBER</p>
                      <div className="flex items-center gap-2">
                        <Truck size={14} className="text-[#D97706]" />
                        <p className="text-[9px] sm:text-[10px] font-black uppercase text-black tracking-widest">{order.tracking_number}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex gap-4 sm:gap-8 group/item">
                    <div className="relative w-20 h-28 sm:w-24 sm:h-32 bg-gray-50 flex-shrink-0 overflow-hidden rounded-xl border border-transparent group-hover/item:border-gray-200 transition-all shadow-sm">
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover/item:scale-110"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#2D2D2D] leading-tight sm:leading-relaxed flex-1">
                            {item.product_name}
                          </h4>
                          <p className="text-[10px] sm:text-[11px] font-black text-black">₹{item.price.toLocaleString()}</p>
                        </div>
                        <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-4 items-center">
                          <div className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-50 border border-gray-100 rounded-sm flex items-center gap-1.5 sm:gap-2">
                            <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-gray-400">SIZE</span>
                            <span className="text-[8px] sm:text-[9px] font-black uppercase text-black">{item.size}</span>
                          </div>
                          {item.color && (
                            <div className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-50 border border-gray-100 rounded-sm flex items-center gap-1.5 sm:gap-2">
                              <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-gray-400">COLOR</span>
                              <span className="text-[8px] sm:text-[9px] font-black uppercase text-black">{item.color}</span>
                            </div>
                          )}
                          <div className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-50 border border-gray-100 rounded-sm flex items-center gap-1.5 sm:gap-2">
                            <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-gray-400">QTY</span>
                            <span className="text-[8px] sm:text-[9px] font-black uppercase text-black">{item.quantity}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-0">
                        <Link 
                          href="/all"
                          className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-[#D97706] hover:underline"
                        >
                          Buy it again
                        </Link>
                        <span className="text-gray-100 italic">|</span>
                        <Link 
                          href="/all"
                          className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black"
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
