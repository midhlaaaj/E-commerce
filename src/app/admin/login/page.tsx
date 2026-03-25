'use client';

import { useState } from 'react';
import { adminLogin } from './actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowRight, Lock, ShieldCheck, User as UserIcon } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Starting admin login for:', email);
      const result = await adminLogin({ email, password });

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.success) {
        setSuccess(true);
        router.replace('/admin');
        router.refresh(); // Ensure middleware and layout see the new cookie
      }
    } catch (err: any) {
      console.error('FINAL LOGIN ERROR:', err);
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-[#D97706]/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-white/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-12 space-y-10">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D97706] rounded-2xl mb-2 rotate-3 shadow-2xl shadow-[#D97706]/20">
                <ShieldCheck className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-black text-white tracking-tighter italic">
                  ELITE<span className="text-[#D97706]">ADMIN</span>
                </h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em] mt-2">Management Gateway</p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D97706] transition-colors" size={18} />
                  <input 
                    type="email" 
                    required
                    placeholder="Admin Email"
                    className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:bg-white/10 transition-all placeholder:text-gray-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D97706] transition-colors" size={18} />
                  <input 
                    type="password" 
                    required
                    placeholder="Secret Key / Password"
                    className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:bg-white/10 transition-all placeholder:text-gray-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                type="submit"
                className="w-full py-5 bg-[#D97706] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-2xl shadow-[#D97706]/20 active:scale-95 flex items-center justify-center gap-3 group"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'INITIALIZE ACCESS'}
                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="text-center pt-6">
              <Link href="/" className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] hover:text-[#D97706] transition-colors">
                ← Return to Public Site
              </Link>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[9px] text-white/20 font-bold uppercase tracking-[0.5em]">
          ELITEWEAR SECURED PROTOCOL
        </p>
      </div>
    </div>
  );
}
