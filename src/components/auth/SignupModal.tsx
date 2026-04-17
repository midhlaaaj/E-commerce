'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowRight, Mail, Lock, User, X, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const SignupModal = ({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) => {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => {
        onClose();
        // router.refresh() is now handled globally by useAuth listener
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
        <div className="relative w-full max-w-md bg-white p-12 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-black text-white flex items-center justify-center mx-auto shadow-2xl">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black tracking-tighter uppercase text-black leading-none">
              WELCOME TO <span className="font-thin italic">ELITE</span>
            </h2>
            <p className="text-black/40 text-[9px] font-black uppercase tracking-[0.4em]">
              Redirecting to your collection...
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 flex items-center justify-center rounded-sm bg-black">
              <span className="font-bold text-xl italic text-white leading-none">E</span>
            </div>
            <span className="font-heading font-black text-xl tracking-tighter text-black uppercase">ELITEWEAR</span>
          </div>

          {/* Title */}
          <div className="w-full text-center mb-8">
            <h2 className="text-[10px] font-black tracking-[0.5em] text-black/30 uppercase mb-2">MEMBERSHIP</h2>
            <h1 className="text-4xl font-thin tracking-tight uppercase text-black">
              SIGN <span className="font-black tracking-tighter">UP</span>
            </h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-600 text-[9px] font-black uppercase tracking-[0.3em] text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="w-full space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-0 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={14} />
                <input 
                  type="text" 
                  required
                  placeholder="FULL DESIGNATION"
                  className="w-full pl-8 pr-0 py-4 bg-transparent border-b border-black/10 text-[11px] font-bold tracking-widest focus:border-black transition-all outline-none placeholder:text-black/20 autofill:shadow-[inset_0_0_0_1000px_white]"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

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

              <div className="relative group">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={14} />
                <input 
                  type="password" 
                  required
                  placeholder="SECURITY KEY"
                  className="w-full pl-8 pr-0 py-4 bg-transparent border-b border-black/10 text-[11px] font-bold tracking-widest focus:border-black transition-all outline-none placeholder:text-black/20 autofill:shadow-[inset_0_0_0_1000px_white]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full py-5 bg-black text-white rounded-none text-[10px] font-black uppercase tracking-[0.4em] hover:bg-gray-900 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : null}
              {loading ? 'PROCESSING' : 'SIGN UP'}
              {!loading && <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center pt-2 w-full">
            <p className="text-[9px] text-black/30 font-black uppercase tracking-[0.4em] mb-4">
              Already have an account?
            </p>
            <button 
              onClick={onSwitchToLogin}
              className="inline-flex items-center gap-3 text-[10px] font-black text-black uppercase tracking-[0.3em] group border-b border-black/10 hover:border-black pb-1 transition-all"
            >
              Access your profile
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
