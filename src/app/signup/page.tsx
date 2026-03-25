'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowRight, Mail, Lock, User, CheckCircle2 } from 'lucide-react';

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
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight italic">Registration Successful</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Welcome to the elite circle. Redirecting you to login in a moment...
          </p>
          <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 animate-[progress_3s_linear]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-10 space-y-8">
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block mb-4">
               <span className="font-heading font-black text-3xl tracking-tighter">ELITE<span className="text-[#D97706]">WEAR</span></span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight italic">Join the Collection</h1>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-widest text-center mx-auto">Create your personalized account</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold uppercase tracking-widest">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#D97706] transition-all"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
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
                  placeholder="Password (Min. 6 chars)"
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
              {loading ? 'Creating Account...' : 'Sign Up'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-xs text-gray-500 font-medium">
              Already have an account? {' '}
              <Link href="/login" className="text-[#D97706] font-bold hover:underline underline-offset-4">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
