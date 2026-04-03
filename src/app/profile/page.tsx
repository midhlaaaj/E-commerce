'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import { SectionHeader } from '@/components/layout/SectionHeader';

export default function ProfileDetailsPage() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    birthday: '',
  });

  useEffect(() => {
    if (profile || user) {
      setFormData({
        full_name: profile?.full_name || '',
        email: user?.email || '',
        phone: profile?.phone || '',
        birthday: profile?.birthday || '',
      });
    }
  }, [profile, user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          birthday: formData.birthday,
        })
        .eq('id', user?.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      console.error('Update error:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <SectionHeader 
        title1="PROFILE" 
        title2="DETAILS" 
        subtitle="PERSONAL INFORMATION"
        className="mb-12"
      />

      <form onSubmit={handleUpdate} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500 ml-1">
              Full Name
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D97706] transition-colors" size={18} />
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm focus:ring-2 focus:ring-[#D97706]/20 transition-all outline-none"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email (Read Only) */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500 ml-1">
              Email Address
            </label>
            <div className="relative group opacity-60">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={formData.email}
                readOnly
                className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-12 pr-6 text-sm outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500 ml-1">
              Phone Number
            </label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D97706] transition-colors" size={18} />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm focus:ring-2 focus:ring-[#D97706]/20 transition-all outline-none"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          {/* Birthday */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500 ml-1">
              Birthday
            </label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D97706] transition-colors" size={18} />
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm focus:ring-2 focus:ring-[#D97706]/20 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {message && (
          <div className={cn(
            "p-4 rounded-2xl text-xs font-medium tracking-wide animate-in fade-in slide-in-from-top-2 duration-300",
            message.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          )}>
            {message.text}
          </div>
        )}

        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-12 py-4 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase transition-all shadow-xl shadow-black/5 active:scale-[0.98]"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
