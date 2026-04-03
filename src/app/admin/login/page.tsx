'use client';

import { useState } from 'react';
import { adminLogin } from './actions';
import Link from 'next/link';
import { Loader2, ArrowRight } from 'lucide-react';

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
        window.location.href = '/admin';
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 selection:bg-black selection:text-white">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Link href="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-sm">
              E
            </div>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Admin Gateway</h1>
          <p className="text-sm text-gray-500 mt-2">Sign in to manage your storefront</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-500 delay-150 fill-mode-both">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-3">
              <span className="block mt-0.5">•</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 ml-1">
                Email address
              </label>
              <input 
                type="email" 
                required
                placeholder="admin@elitewear.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-900 transition-all placeholder:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 ml-1">
                Password
              </label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-900 transition-all placeholder:text-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="pt-2">
              <button 
                disabled={loading}
                type="submit"
                className="w-full py-3.5 px-4 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 group"
              >
                {loading ? <Loader2 className="animate-spin text-gray-400" size={18} /> : null}
                <span>{loading ? 'Signing in...' : 'Sign in'}</span>
                {!loading && <ArrowRight size={16} className="text-gray-400 group-hover:translate-x-1 group-hover:text-white transition-all" />}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center animate-in fade-in duration-1000 delay-300 fill-mode-both">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-900 font-medium transition-colors">
            ← Back to public site
          </Link>
        </div>
      </div>
    </div>
  );
}
