'use client';

import { useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowRight, Mail, Lock, User, CheckCircle2 } from 'lucide-react';
import { AuthLayoutWrapper } from '@/components/auth/AuthLayoutWrapper';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
      setTimeout(() => window.location.href = '/', 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"
          alt="Success Background"
          fill
          className="object-cover opacity-40 brightness-50"
        />
        <div className="w-full max-w-md bg-white border border-white/20 p-16 text-center space-y-10 relative z-10 animate-in fade-in zoom-in-95 duration-1000">
          <div className="w-24 h-24 bg-black text-white flex items-center justify-center mx-auto shadow-2xl">
            <CheckCircle2 size={48} />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-black tracking-tighter uppercase text-black leading-none">
              WELCOME TO <span className="font-extralight italic">ELITE</span>
            </h2>
            <p className="text-black/40 text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed">
              Redirecting to your collection...
            </p>
          </div>
          <div className="h-[2px] w-full bg-black/5 overflow-hidden">
            <div className="h-full bg-black animate-[progress_3s_linear]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthLayoutWrapper
      title1="SIGN"
      title2="UP"
      subtitle="MEMBERSHIP"
      imageUrl="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
    >
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 text-[9px] font-black uppercase tracking-[0.3em] animate-in fade-in slide-in-from-top-2 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6 pt-2">
          <div className="space-y-8 pb-4">
            <div className="space-y-3">
              <label className="text-[9px] font-black tracking-[0.4em] uppercase text-black/30 ml-1">
                Full Designation
              </label>
              <div className="relative group">
                <User className="absolute left-0 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={14} />
                <input 
                  type="text" 
                  required
                  placeholder="NAME NAME"
                  className="w-full pl-8 pr-0 py-4 bg-transparent border-b border-black/10 text-[11px] font-bold uppercase tracking-widest focus:border-black transition-all outline-none placeholder:text-black/10"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black tracking-[0.4em] uppercase text-black/30 ml-1">
                Email Identity
              </label>
              <div className="relative group">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={14} />
                <input 
                  type="email" 
                  required
                  placeholder="NAME@EXAMPLE.COM"
                  className="w-full pl-8 pr-0 py-4 bg-transparent border-b border-black/10 text-[11px] font-bold uppercase tracking-widest focus:border-black transition-all outline-none placeholder:text-black/10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black tracking-[0.4em] uppercase text-black/30 ml-1">
                Security Key
              </label>
              <div className="relative group">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={14} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-8 pr-0 py-4 bg-transparent border-b border-black/10 text-[11px] font-bold uppercase tracking-widest focus:border-black transition-all outline-none placeholder:text-black/10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="w-full py-6 bg-black text-white rounded-none text-[10px] font-black uppercase tracking-[0.5em] hover:bg-gray-900 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : null}
            {loading ? 'PROCESSING' : 'RESERVE ACCESS'}
            {!loading && <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />}
          </button>
        </form>

        <div className="text-center pt-12 space-y-4">
          <p className="text-[9px] text-black/30 font-black uppercase tracking-[0.4em]">
            Already have an account?
          </p>
          <Link 
            href="/login" 
            className="inline-flex items-center gap-3 text-[10px] font-black text-black uppercase tracking-[0.3em] group border-b-2 border-black/10 hover:border-black pb-2 transition-all"
          >
            Access your profile
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </AuthLayoutWrapper>
  );
}
