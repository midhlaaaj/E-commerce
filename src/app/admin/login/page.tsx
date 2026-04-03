'use client';

import { useState } from 'react';
import { adminLogin } from './actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowRight, Lock, User as UserIcon } from 'lucide-react';

import { AuthLayoutWrapper } from '@/components/auth/AuthLayoutWrapper';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await adminLogin({ email, password });

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.success) {
        // Full page reload for absolute cookie synchronization
        window.location.href = '/admin';
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayoutWrapper
      title1="ADMIN"
      title2="ACCESS"
      subtitle="MASTER TERMINAL"
      imageUrl="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop"
    >
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 text-[9px] font-black uppercase tracking-[0.3em] animate-in fade-in slide-in-from-top-2 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 pt-2">
          <div className="space-y-8 pb-4">
            <div className="space-y-3">
              <label className="text-[9px] font-black tracking-[0.4em] uppercase text-black/30 ml-1">
                Admin Identity
              </label>
              <div className="relative group">
                <UserIcon className="absolute left-0 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={14} />
                <input 
                  type="email" 
                  required
                  placeholder="ADMIN@ELITEWEAR.COM"
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
            className="w-full py-6 bg-black text-white rounded-none text-[10px] font-black uppercase tracking-[0.5em] hover:opacity-80 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : null}
            {loading ? 'AUTHENTICATING' : 'INITIALIZE ACCESS'}
            {!loading && <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />}
          </button>
        </form>

        <div className="text-center pt-10">
          <Link href="/" className="text-[9px] text-black/40 font-black uppercase tracking-[0.3em] hover:text-black transition-colors border-b border-transparent hover:border-black/10 pb-1">
            ← Return to public site
          </Link>
        </div>
      </div>
    </AuthLayoutWrapper>
  );
}
