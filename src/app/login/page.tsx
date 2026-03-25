'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowRight, Mail, Lock, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is admin to redirect accordingly
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-10 space-y-8">
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block mb-4">
               <span className="font-heading font-black text-3xl tracking-tighter">ELITE<span className="text-[#D97706]">WEAR</span></span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight italic">Welcome Back</h1>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Sign in to your account</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#D97706] transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#D97706] transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-black text-white rounded-2xl text-sm font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : null}
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="text-center space-y-4 pt-4">
            <p className="text-xs text-gray-500 font-medium">
              Don't have an account? {' '}
              <Link href="/signup" className="text-[#D97706] font-bold hover:underline underline-offset-4">Create Account</Link>
            </p>
            <div className="flex items-center justify-center gap-2 pt-4 opacity-50">
               <ShieldCheck size={14} className="text-green-600" />
               <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Secure Verification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
