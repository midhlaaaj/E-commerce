'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowRight, Mail, Lock, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export const LoginModal = ({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Close modal and refresh the current page's server components
      // This triggers the Navbar to re-render with the new user state
      onClose();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white shadow-2xl border border-black/[0.05] p-8 md:p-12 flex flex-col items-center">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-black/20 hover:text-black transition-colors"
          >
            <X size={20} />
          </button>

          {/* Logo Section */}
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 flex items-center justify-center rounded-sm bg-black">
              <span className="font-bold text-xl italic text-white leading-none">E</span>
            </div>
            <span className="font-heading font-black text-xl tracking-tighter text-black uppercase">ELITEWEAR</span>
          </div>

          {/* Title */}
          <div className="w-full text-center mb-10">
            <h2 className="text-[10px] font-black tracking-[0.5em] text-black/30 uppercase mb-2">RETURNING MEMBER</h2>
            <h1 className="text-4xl font-thin tracking-tight uppercase text-black">
              LOG <span className="font-black tracking-tighter">IN</span>
            </h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-600 text-[9px] font-black uppercase tracking-[0.3em] text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="w-full space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="relative group">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={14} />
                  <input 
                    type="email" 
                    required
                    placeholder="EMAIL IDENTITY"
                    className="w-full pl-8 pr-0 py-4 bg-transparent border-b border-black/10 text-[11px] font-bold tracking-widest focus:border-black transition-all outline-none placeholder:text-black/20 autofill:shadow-[inset_0_0_0_1000px_white]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={14} />
                  <input 
                    type="password" 
                    required
                    placeholder="SECURITY KEY"
                    className="w-full pl-8 pr-0 py-4 bg-transparent border-b border-black/10 text-[11px] font-bold uppercase tracking-widest focus:border-black transition-all outline-none placeholder:text-black/20 autofill:shadow-[inset_0_0_0_1000px_white]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full py-5 bg-black text-white rounded-none text-[10px] font-black uppercase tracking-[0.4em] hover:bg-gray-900 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : null}
              {loading ? 'AUTHENTICATING' : 'LOG IN'}
              {!loading && <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-8 text-center pt-2 w-full">
            <p className="text-[9px] text-black/30 font-black uppercase tracking-[0.4em] mb-4">
              New to the Elite Circle?
            </p>
            <button 
              onClick={onSwitchToSignup}
              className="inline-flex items-center gap-3 text-[10px] font-black text-black uppercase tracking-[0.3em] group border-b border-black/10 hover:border-black pb-1 transition-all"
            >
              Create your account
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
