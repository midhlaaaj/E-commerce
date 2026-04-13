'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapPin, Plus, Trash2, CheckCircle2, Home, Briefcase, MoreHorizontal } from 'lucide-react';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { AddressesSkeleton } from '@/components/profile/ProfileSkeleton';
import { useProfileStore } from '@/store/use-profile-store';

export default function AddressesPage() {
  const { user, profileLoading, supabase } = useAuth();
  const { addresses, hasLoadedAddresses, setAddresses } = useProfileStore();
  const [localLoading, setLocalLoading] = useState(!hasLoadedAddresses);

  const fetchAddresses = useCallback(async (silent = false) => {
    if (!user) return;
    if (!silent) setLocalLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('shipping_addresses')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLocalLoading(false);
    }
  }, [user, setAddresses]);

  useEffect(() => {
    // If we already have data, fetch silently in the background
    fetchAddresses(hasLoadedAddresses);
  }, [fetchAddresses, hasLoadedAddresses]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      const { error } = await supabase
        .from('shipping_addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      // Optimistic update
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (err) {
      console.error('Error deleting address:', err);
      alert('Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const { error } = await supabase
        .from('shipping_addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
      fetchAddresses(true); // Silent refresh
    } catch (err) {
      console.error('Error setting default address:', err);
    }
  };

  // Only show skeleton on first-ever load or if we explicitly don't have data yet
  if ((profileLoading || localLoading) && !hasLoadedAddresses) {
    return <AddressesSkeleton />;
  }

  return (
    <div className="animate-in fade-in duration-700">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Address shortcut */}
        <button 
          onClick={() => window.location.href = '/cart'}
          className="flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border-2 border-dashed border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all group min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-sm bg-gray-50 flex items-center justify-center group-hover:bg-black transition-colors">
            <Plus className="text-gray-400 group-hover:text-white" size={24} />
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase text-gray-500 group-hover:text-black">
            Add New Address via Cart
          </span>
        </button>

        {addresses.map((addr) => (
          <div 
            key={addr.id}
            className={cn(
              "relative p-8 rounded-3xl border transition-all flex flex-col justify-between group h-full",
              addr.is_default ? "border-gray-200 bg-gray-50/30 shadow-xl shadow-black/5" : "border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-black/5"
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-sm flex items-center justify-center",
                    addr.is_default ? "bg-black text-white" : "bg-gray-50 text-gray-400"
                  )}>
                    {addr.address_type === 'home' ? <Home size={14} /> : addr.address_type === 'work' ? <Briefcase size={14} /> : <MapPin size={14} />}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                    {addr.address_type}
                  </span>
                </div>
                {addr.is_default ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 size={14} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Default</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-[8px] font-black uppercase tracking-widest text-gray-300 hover:text-black transition-colors"
                  >
                    Make Default
                  </button>
                )}
              </div>

              <div className="space-y-1 mb-6">
                <h4 className="text-[12px] font-black uppercase tracking-widest text-black">{addr.full_name}</h4>
                <p className="text-[10px] font-bold text-gray-400 tracking-widest">{addr.phone}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] text-gray-500 uppercase leading-relaxed font-medium">
                  {addr.house_no}, {addr.address_line}, {addr.locality}
                </p>
                <p className="text-[11px] font-black uppercase tracking-widest text-black">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-end gap-6">
              <button 
                onClick={() => handleDelete(addr.id)}
                className="text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
              <button className="text-gray-300 hover:text-black transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        ))}

        {addresses.length === 0 && !hasLoadedAddresses && !localLoading && (
          <div className="p-8 rounded-3xl bg-gray-50/50 flex flex-col items-center justify-center text-center py-16">
            <MapPin size={32} className="text-gray-200 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">No addresses saved yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
