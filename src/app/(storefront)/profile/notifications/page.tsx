'use client';

import { Bell } from 'lucide-react';
import { SectionHeader } from '@/components/layout/SectionHeader';

export default function NotificationsPage() {
  return (
    <div className="max-w-4xl">
      <SectionHeader 
        title1="MY" 
        title2="NOTIFICATIONS" 
        subtitle="STAY INFORMED"
        className="mb-12"
      />

      <div className="space-y-6">
        <div className="p-8 rounded-3xl bg-gray-50/50 flex flex-col items-center justify-center text-center opacity-40 grayscale min-h-[300px]">
          <Bell size={48} className="text-gray-300 mb-6 animate-pulse" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Staying Informed</h3>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
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
