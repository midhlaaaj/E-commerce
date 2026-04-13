'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

// Unified Date Picker (Matching 'Sort By' design)
// Defined OUTSIDE to prevent re-mounting and state loss on every parent render
const UnifiedDatePicker = ({ 
  value, 
  onChange, 
  disabled 
}: { 
  value: string, 
  onChange: (date: string) => void,
  disabled: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [year, month, day] = value ? value.split('-') : ['', '', ''];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const years = Array.from({ length: 101 }, (_, i) => (new Date().getFullYear() - i).toString());
  const months = [
    { label: 'JAN', value: '01' }, { label: 'FEB', value: '02' }, { label: 'MAR', value: '03' },
    { label: 'APR', value: '04' }, { label: 'MAY', value: '05' }, { label: 'JUN', value: '06' },
    { label: 'JUL', value: '07' }, { label: 'AUG', value: '08' }, { label: 'SEP', value: '09' },
    { label: 'OCT', value: '10' }, { label: 'NOV', value: '11' }, { label: 'DEC', value: '12' }
  ];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  const monthLabel = months.find(m => m.value === month)?.label || 'MM';
  const displayDate = value && year && month && day ? `${day} ${monthLabel} ${year}` : 'SELECT DATE';

  const handleSelect = (type: 'day' | 'month' | 'year', val: string) => {
    const newValues = {
      day: type === 'day' ? val : day,
      month: type === 'month' ? val : month,
      year: type === 'year' ? val : year,
    };
    if (newValues.day && newValues.month && newValues.year) {
      onChange(`${newValues.year}-${newValues.month}-${newValues.day}`);
    } else {
      onChange(`${newValues.year || ''}-${newValues.month || ''}-${newValues.day || ''}`.replace(/-+$/, ''));
    }
  };

  return (
    <div className="relative w-full sm:w-[280px]" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onMouseDown={(e) => {
          if (disabled) return;
          setIsOpen(!isOpen);
        }}
        className={cn(
          "w-full flex items-center justify-between gap-8 px-6 py-3 border border-gray-100 bg-white text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-none outline-none focus:outline-none",
          !disabled && "hover:border-black hover:shadow-lg hover:shadow-black/5 cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed bg-gray-50/50 grayscale pointer-events-none"
        )}
      >
        <span className={cn(value ? "text-black" : "text-gray-400 font-bold")}>{displayDate}</span>
        <ChevronDown size={14} className={cn("transition-transform duration-300 text-gray-400 font-bold", isOpen && "rotate-180")} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-100 shadow-2xl z-[999] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            {/* Day Column */}
            <div className="max-h-[220px] overflow-y-auto bg-white [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {days.map((d) => (
                <button
                  key={d}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleSelect('day', d); }}
                  className={cn(
                    "w-full text-center py-3 text-[10px] font-black uppercase tracking-widest transition-colors",
                    day === d ? "bg-black text-white" : "text-gray-400 hover:bg-gray-50 hover:text-black"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
            {/* Month Column */}
            <div className="max-h-[220px] overflow-y-auto bg-white [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {months.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleSelect('month', m.value); }}
                  className={cn(
                    "w-full text-center py-3 text-[10px] font-black uppercase tracking-widest transition-colors",
                    month === m.value ? "bg-black text-white" : "text-gray-400 hover:bg-gray-50 hover:text-black"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
            {/* Year Column */}
            <div className="max-h-[220px] overflow-y-auto bg-white [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {years.map((y) => (
                <button
                  key={y}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleSelect('year', y); }}
                  className={cn(
                    "w-full text-center py-3 text-[10px] font-black uppercase tracking-widest transition-colors",
                    year === y ? "bg-black text-white" : "text-gray-400 hover:bg-gray-50 hover:text-black"
                  )}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50/10">
             <button 
               type="button"
               onMouseDown={(e) => { e.preventDefault(); setIsOpen(false); }}
               className="text-[9px] font-black uppercase tracking-widest text-black hover:underline"
             >
               Confirm
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const dynamic = 'force-dynamic';

export default function ProfileDetailsPage() {
  const { user, profile, signOut, supabase } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
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
          birthday: formData.birthday || null,
        })
        .eq('id', user?.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err: any) {
      console.error('Update error:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <form onSubmit={handleUpdate} className="space-y-8 md:space-y-12 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          {/* Full Name */}
          <div className="space-y-2 border-b border-gray-100 pb-1 group focus-within:border-black transition-colors">
            <label className="text-[9px] font-black tracking-[0.2em] uppercase text-gray-400 block">
              Full Name
            </label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full bg-transparent py-2 text-[11px] font-black tracking-widest uppercase outline-none disabled:text-gray-500 transition-all font-sans"
              placeholder="Full Name"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-2 border-b border-gray-100 pb-1 opacity-70">
            <label className="text-[9px] font-black tracking-[0.2em] uppercase text-gray-400 block">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full bg-transparent py-2 text-[11px] font-bold tracking-widest outline-none cursor-not-allowed italic font-sans"
              placeholder="admin@gmail.com"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2 border-b border-gray-100 pb-1 group focus-within:border-black transition-colors">
            <label className="text-[9px] font-black tracking-[0.2em] uppercase text-gray-400 block">
              Phone Number
            </label>
            <input
              type="tel"
              disabled={!isEditing}
              value={formData.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 10) setFormData({ ...formData, phone: val });
              }}
              maxLength={10}
              className="w-full bg-transparent py-2 text-[11px] font-black tracking-widest outline-none disabled:text-gray-500 transition-all font-mono"
              placeholder="0000000000"
            />
          </div>

          {/* Birthday Dropdowns */}
          <div className="space-y-4 md:col-span-2">
            <label className="text-[9px] font-black tracking-[0.2em] uppercase text-gray-400 block">
              Date of Birth
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <UnifiedDatePicker 
                value={formData.birthday} 
                onChange={(date) => setFormData({ ...formData, birthday: date })} 
                disabled={!isEditing} 
              />
            </div>
          </div>
        </div>

        {message && (
          <div className={cn(
            "p-5 text-[10px] font-black tracking-[0.2em] uppercase text-left animate-in fade-in slide-in-from-top-2 duration-300",
            message.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          )}>
            {message.text}
          </div>
        )}

        <div className="pt-6 flex flex-wrap gap-6 items-center">
          {!isEditing ? (
            <div className="flex flex-nowrap gap-3 sm:gap-4 items-center">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="bg-black text-white px-6 py-3.5 sm:px-12 sm:py-5 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black/90 transition-all active:scale-95 shadow-xl shadow-black/10 flex-1 sm:flex-none whitespace-nowrap"
              >
                Edit Profile
              </button>
              <button
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  try {
                    await signOut();
                  } catch (err) {
                    console.error('Logout error:', err);
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="bg-red-600 text-white px-6 py-3.5 sm:px-12 sm:py-5 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-all active:scale-95 shadow-xl shadow-red-900/10 disabled:opacity-50 flex-1 sm:flex-none whitespace-nowrap"
              >
                {loading ? 'WAIT...' : 'Log Out'}
              </button>
            </div>
          ) : (
            <>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#2D2D2D] text-white px-12 py-5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/5 disabled:opacity-50"
              >
                {loading ? 'Wait...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
