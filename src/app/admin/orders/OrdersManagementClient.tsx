'use client';

import { useState, useMemo } from 'react';
import { adminSupabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  X,
  ChevronRight,
  MoreVertical,
  MapPin,
  Phone,
  Mail,
  User as UserIcon,
  ShoppingBag,
  Loader2,
  Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type OrderStatus = 'confirmed' | 'packed' | 'dispatched' | 'delivered';

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  size: string;
  color: string | null;
}

interface ShippingAddress {
  full_name: string;
  phone: string;
  pincode: string;
  house_no: string;
  address_line: string;
  locality: string;
  city: string;
  state: string;
}

interface Order {
  id: string;
  created_at: string;
  status: OrderStatus;
  total_amount: number;
  tracking_number: string | null;
  profiles?: {
    full_name: string;
    email: string;
  };
  shipping_addresses?: ShippingAddress;
  order_items?: OrderItem[];
}

export default function OrdersManagementClient() {
  const { supabase: authSupabase, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusInput, setStatusInput] = useState<OrderStatus>('confirmed');
  const [trackingInput, setTrackingInput] = useState('');

  const { data: orders = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['orders', !!authSupabase],
    enabled: !authLoading,
    queryFn: async () => {
      const { data, error } = await authSupabase
        .from('orders')
        .select(`
          id, 
          created_at, 
          status, 
          total_amount, 
          tracking_number,
          profiles!fk_orders_user(full_name, email),
          shipping_addresses!fk_orders_address(*),
          order_items!fk_order_items_order(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database Error:', error);
        throw error;
      }
      
      // Transform data to match Order interface.
      // Supabase may return joined records as arrays or single objects depending on relationship config.
      return (data as any[]).map(order => ({
        ...order,
        profiles: Array.isArray(order.profiles) ? order.profiles[0] : (order.profiles || null),
        shipping_addresses: Array.isArray(order.shipping_addresses) ? order.shipping_addresses[0] : (order.shipping_addresses || null)
      })) as Order[];
    }
  });

  const handleUpdateOrder = async (orderId: string) => {
    setIsUpdating(true);
    try {
      const { error } = await authSupabase
        .from('orders')
        .update({ 
          status: statusInput,
          tracking_number: trackingInput 
        })
        .eq('id', orderId);

      if (error) throw error;
      
      // We don't need to manually update local state anymore!
      // The global RealtimeDatabaseSync will detect the change and invalidate the 'orders' query.
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order');
    } finally {
      setIsUpdating(false);
    }
  };

  const selectedOrder = useMemo(() => 
    orders.find(o => o.id === selectedOrderId) || null
  , [orders, selectedOrderId]);

  const filteredOrders = useMemo(() => orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ), [orders, searchQuery]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'packed': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'dispatched': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'delivered': return 'text-green-600 bg-green-50 border-green-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const statusOptions: OrderStatus[] = ['confirmed', 'packed', 'dispatched', 'delivered'];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search orders by ID, name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
        >
          <Loader2 className={cn("inline-block h-4 w-4", loading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-3">
          <X size={18} />
          <span>Error loading orders: {(error as any).message}</span>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">Order Details</th>
                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">Customer</th>
                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(loading || authLoading) ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8">
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <ShoppingBag size={40} strokeWidth={1} />
                      <p className="text-sm">No orders found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-gray-400 uppercase mb-1">#{order.id.slice(0, 8)}</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{order.profiles?.full_name || 'N/A'}</span>
                        <span className="text-xs text-gray-400">{order.profiles?.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        getStatusColor(order.status)
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900">₹{order.total_amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          setSelectedOrderId(order.id);
                          setStatusInput(order.status);
                          setTrackingInput(order.tracking_number || '');
                        }}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Side-over */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedOrderId(null)} />
          <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Order #{selectedOrder.id}</p>
                </div>
                <button onClick={() => setSelectedOrderId(null)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Status Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-4 block">Update Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatusInput(status)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all",
                            statusInput === status 
                              ? "bg-black text-white border-black" 
                              : "bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black"
                          )}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-4 block">Courier Tracking</label>
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        placeholder="TRACKING NUMBER"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-black/10"
                        value={trackingInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTrackingInput(val);
                          if (val.trim() && (statusInput === 'confirmed' || statusInput === 'packed')) {
                            setStatusInput('dispatched');
                          }
                        }}
                      />
                      <button 
                        onClick={() => handleUpdateOrder(selectedOrder.id)}
                        disabled={isUpdating}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#D97706] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                      >
                        {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> Update Order</>}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Customer & Shipping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 border-l-2 border-[#D97706] pl-3">Customer Info</h3>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 flex-shrink-0">
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{selectedOrder.profiles?.full_name}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5"><Mail size={12} /> {selectedOrder.profiles?.email}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5"><Phone size={12} /> {selectedOrder.shipping_addresses?.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 border-l-2 border-[#D97706] pl-3">Shipping Address</h3>
                    <div className="flex items-start gap-3 text-gray-600">
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 flex-shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div className="text-xs space-y-1">
                        <p className="font-bold text-gray-900 uppercase tracking-wider">{selectedOrder.shipping_addresses?.full_name}</p>
                        <p className="leading-relaxed">
                          {selectedOrder.shipping_addresses?.house_no}, {selectedOrder.shipping_addresses?.address_line}, 
                          <br />
                          {selectedOrder.shipping_addresses?.locality}, 
                          <br />
                          {selectedOrder.shipping_addresses?.city}, {selectedOrder.shipping_addresses?.state} - {selectedOrder.shipping_addresses?.pincode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 border-l-2 border-[#D97706] pl-3">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.order_items?.map((item: OrderItem) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div className="relative w-20 h-24 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                          <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold uppercase tracking-tight text-gray-900">{item.product_name}</h4>
                            <div className="flex gap-3">
                              <span className="text-[10px] text-gray-400 font-bold uppercase">Size: <span className="text-black">{item.size}</span></span>
                              {item.color && (
                                <span className="text-[10px] text-gray-400 font-bold uppercase">Color: <span className="text-black">{item.color}</span></span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400 font-black tracking-widest italic">{item.quantity} x ₹{item.price.toLocaleString()}</span>
                            <span className="text-sm font-bold text-gray-900">₹{(item.quantity * item.price).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="p-6 bg-black text-white rounded-3xl space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                    <span>Order Total</span>
                    <span>Inclusive of taxes</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black italic">TOTAL</span>
                    <span className="text-3xl font-black">₹{selectedOrder.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
