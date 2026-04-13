'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, 
  Plus, 
  Home, 
  Briefcase, 
  MoreHorizontal, 
  CheckCircle2, 
  Loader2, 
  Navigation,
  Check,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import { useCartStore } from '@/store/use-cart-store';
import { useProfileStore } from '@/store/use-profile-store';

interface Address {
  id: string;
  full_name: string;
  phone: string;
  pincode: string;
  house_no: string;
  address_line: string;
  locality: string;
  city: string;
  state: string;
  address_type: 'home' | 'work' | 'other';
  is_default: boolean;
}

export const ShippingAddress = () => {
  const { user, supabase } = useAuth();
  const { selectedAddressId, setSelectedAddressId } = useCartStore();
  const { addresses, setAddresses } = useProfileStore();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    pincode: '',
    house_no: '',
    address_line: '',
    locality: '',
    city: '',
    state: '',
    address_type: 'home' as 'home' | 'work' | 'other',
    is_default: false
  });

  const fetchAddresses = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('shipping_addresses')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedData = data as any[] | null;
      setAddresses(typedData || []);
      if (typedData && typedData.length > 0 && !selectedAddressId) {
        const defaultAddr = typedData.find((a: any) => a.is_default) || typedData[0];
        setSelectedAddressId(defaultAddr.id);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
        );
        const data = await response.json();
        const addr = data.address;
        
        setFormData(prev => ({
          ...prev,
          pincode: addr.postcode || '',
          city: addr.city || addr.town || addr.village || addr.county || '',
          state: addr.state || '',
          locality: addr.suburb || addr.neighbourhood || addr.subdistrict || '',
          address_line: addr.road || addr.pedestrian || '',
          house_no: addr.house_number || addr.building || ''
        }));
      } catch (err) {
        console.error('Reverse geocoding error:', err);
      } finally {
        setLocationLoading(false);
      }
    }, (error) => {
      console.error('Geolocation error:', error);
      setLocationLoading(false);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    // Safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 10000);

    try {
      const { data, error } = await supabase
        .from('shipping_addresses')
        .insert([{ ...formData, user_id: user.id }])
        .select();

      if (error) {
        console.error('Supabase Insert Error:', error);
        alert(`Database Error [${error.code}]: ${error.message}\n\nDetails: ${error.details || 'None'}\nHint: ${error.hint || 'None'}`);
        throw error;
      }
      
      const newAddress = data?.[0];
      if (!newAddress) throw new Error('No data returned from insert');
      
      setAddresses([newAddress, ...addresses]);
      setSelectedAddressId(newAddress.id);
      setIsAdding(false);
      setFormData({
        full_name: '', phone: '', pincode: '', house_no: '',
        address_line: '', locality: '', city: '', state: '',
        address_type: 'home', is_default: false
      });
    } catch (err: any) {
      console.error('Error saving address:', err);
      if (err.message?.includes('relation "shipping_addresses" does not exist')) {
        alert('Table "shipping_addresses" not found. Please run the provided SQL migration in your Supabase dashboard!');
      } else if (!err.code) {
        // This handles non-supabase errors (like network issues or code errors)
        alert(`Submission Failed: ${err.message || 'Unknown error occurred'}`);
      }
    } finally {
      clearTimeout(safetyTimeout);
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white border border-gray-100 p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-full">
            <MapPin size={20} className="text-gray-400" />
          </div>
          <div>
            <h3 className="text-[12px] font-black uppercase tracking-widest text-black">Delivery Address</h3>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Please login to select a saved address</p>
          </div>
        </div>
        <button 
          className="w-full py-4 border-2 border-dashed border-gray-100 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:border-black hover:text-black transition-all"
          onClick={() => window.location.href = '/profile'}
        >
          Add New Address
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-black flex items-center gap-3">
          <MapPin size={16} />
          Select Delivery Address
        </h3>
        {!isAdding && addresses.length > 0 && (
          <button 
            onClick={() => setIsAdding(true)}
            className="text-[10px] font-black uppercase tracking-widest text-[#D97706] hover:underline"
          >
            + Add New
          </button>
        )}
      </div>

      {isAdding ? (
        <form onSubmit={handleSubmit} className="bg-gray-50/50 border border-gray-100 p-8 space-y-8 animate-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">New Shipping Address</h4>
            <button 
              type="button" 
              onClick={() => handleUseLocation()}
              disabled={locationLoading}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#D97706] hover:text-black transition-colors disabled:opacity-50"
            >
              {locationLoading ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
              Use current location
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              required
              placeholder="FULL NAME"
              className="bg-white border-b border-gray-100 py-3 text-[10px] font-bold tracking-widest uppercase focus:border-black outline-none transition-colors"
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            />
            <input 
              required
              type="tel"
              maxLength={10}
              placeholder="MOBILE NO"
              className="bg-white border-b border-gray-100 py-3 text-[10px] font-bold tracking-widest focus:border-black outline-none transition-colors"
              value={formData.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 10) setFormData({...formData, phone: val});
              }}
            />
            <input 
              required
              placeholder="PIN CODE"
              className="bg-white border-b border-gray-100 py-3 text-[10px] font-bold tracking-widest focus:border-black outline-none transition-colors"
              value={formData.pincode}
              onChange={(e) => setFormData({...formData, pincode: e.target.value})}
            />
            <input 
              required
              placeholder="TOWN / LOCALITY"
              className="bg-white border-b border-gray-100 py-3 text-[10px] font-bold tracking-widest uppercase focus:border-black outline-none transition-colors"
              value={formData.locality}
              onChange={(e) => setFormData({...formData, locality: e.target.value})}
            />
            <input 
              required
              placeholder="HOUSE NO / BUILDING / BLOCK"
              className="bg-white border-b border-gray-100 py-3 text-[10px] font-bold tracking-widest uppercase focus:border-black outline-none transition-colors"
              value={formData.house_no}
              onChange={(e) => setFormData({...formData, house_no: e.target.value})}
            />
            <input 
              required
              placeholder="ADDRESS (AREA / STREET)"
              className="bg-white border-b border-gray-100 py-3 text-[10px] font-bold tracking-widest uppercase focus:border-black outline-none transition-colors"
              value={formData.address_line}
              onChange={(e) => setFormData({...formData, address_line: e.target.value})}
            />
            <input 
              required
              placeholder="CITY / DISTRICT"
              className="bg-white border-b border-gray-100 py-3 text-[10px] font-bold tracking-widest uppercase focus:border-black outline-none transition-colors"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
            />
            <input 
              required
              placeholder="STATE"
              className="bg-white border-b border-gray-100 py-3 text-[10px] font-bold tracking-widest uppercase focus:border-black outline-none transition-colors"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
            />
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Address Type:</span>
            {(['home', 'work', 'other'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({...formData, address_type: type})}
                className={cn(
                  "px-6 py-2 text-[9px] font-black uppercase tracking-widest border transition-all",
                  formData.address_type === type ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-100 hover:border-black"
                )}
              >
                {type}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-3 cursor-pointer group w-fit">
            <div className="relative flex items-center justify-center">
              <input 
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) => setFormData({...formData, is_default: e.target.checked})}
                className="peer w-5 h-5 border-2 border-gray-200 rounded appearance-none checked:bg-black checked:border-black transition-all"
              />
              <Check size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-black transition-colors">
              Make this as my default address
            </span>
          </label>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#D97706] transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Save and Deliver Here'}
            </button>
            <button 
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div 
              key={addr.id}
              onClick={() => setSelectedAddressId(addr.id)}
              className={cn(
                "relative p-6 border transition-all cursor-pointer group",
                selectedAddressId === addr.id 
                  ? "bg-black border-black shadow-xl shadow-black/10 -translate-y-1" 
                  : "bg-white border-gray-100 hover:border-black"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full",
                    selectedAddressId === addr.id ? "bg-white/10 text-white" : "bg-gray-100 text-gray-500"
                  )}>
                    {addr.address_type}
                  </span>
                  {addr.is_default && (
                    <span className="text-[#D97706]"><CheckCircle2 size={14} /></span>
                  )}
                </div>
                {selectedAddressId === addr.id && (
                  <div className="w-5 h-5 bg-[#D97706] rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <p className={cn(
                  "text-[11px] font-black uppercase tracking-widest",
                  selectedAddressId === addr.id ? "text-white" : "text-black"
                )}>
                  {addr.full_name}
                </p>
                <p className={cn(
                  "text-[10px] font-bold tracking-widest",
                  selectedAddressId === addr.id ? "text-white/60" : "text-gray-400"
                )}>
                  {addr.phone}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100/10 space-y-1">
                <p className={cn(
                  "text-[10px] font-medium leading-relaxed uppercase tracking-tight",
                  selectedAddressId === addr.id ? "text-white/80" : "text-gray-500"
                )}>
                  {addr.house_no}, {addr.address_line}, {addr.locality}
                </p>
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-widest",
                  selectedAddressId === addr.id ? "text-white" : "text-black"
                )}>
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>
            </div>
          ))}
          
          <button 
            className="w-full h-full min-h-[200px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-[#D97706] hover:text-[#D97706] transition-all group"
            onClick={() => setIsAdding(true)}
          >
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-orange-50 transition-colors">
              <Plus size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add New Address</span>
          </button>
        </div>
      )}
    </div>
  );
};
