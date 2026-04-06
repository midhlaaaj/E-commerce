'use client';

import { Bell } from 'lucide-react';
import { SectionHeader } from '@/components/layout/SectionHeader';

export default function NotificationsPage() {
  return (
    <div className="animate-in fade-in duration-700">


      <div className="space-y-6">
        <div className="p-8 rounded-3xl bg-gray-50/50 flex flex-col items-center justify-center text-center opacity-40 grayscale min-h-[300px]">
          <Bell size={48} className="text-gray-300 mb-6 animate-pulse" />
          <h3 className="text-sm font-black uppercase tracking-widest text-[#2D2D2D] mb-4">Staying Informed</h3>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-12 max-w-xs leading-relaxed">
            You'll receive notifications about your orders, returns, and special offers here. 
            Currently, there are no new updates.
          </p>
        </div>
        
        <div className="flex items-center justify-between p-6 rounded-2xl border border-gray-100">
           <div className="space-y-1">
              <p className="text-sm font-semibold tracking-tight">Email Notifications</p>
              <p className="text-xs text-gray-400">Receive updates via your registered email</p>
           </div>
           <div className="w-12 h-6 bg-[#D97706] rounded-full relative shadow-inner cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
           </div>
        </div>
      </div>
    </div>
  );
}
