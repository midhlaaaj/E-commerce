'use client';

import { MapPin, Plus } from 'lucide-react';
import { SectionHeader } from '@/components/layout/SectionHeader';

export default function AddressesPage() {
  return (
    <div className="max-w-4xl">
      <SectionHeader 
        title1="SAVED" 
        title2="ADDRESSES" 
        subtitle="DELIVERY LOCATIONS"
        className="mb-12"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Placeholder for Add Address */}
        <button className="flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border-2 border-dashed border-gray-100 hover:border-[#D97706]/30 hover:bg-gray-50 transition-all group">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#F3E8DF] transition-colors">
            <Plus className="text-gray-400 group-hover:text-[#8C5E45]" size={24} />
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">
            Add New Address
          </span>
        </button>

        {/* Placeholder for No Addresses */}
        <div className="p-8 rounded-3xl bg-gray-50/50 flex flex-col items-center justify-center text-center opacity-40 grayscale">
          <MapPin size={32} className="text-gray-300 mb-4" />
          <p className="text-xs font-medium text-gray-500">No addresses saved yet</p>
        </div>
      </div>
    </div>
  );
}
