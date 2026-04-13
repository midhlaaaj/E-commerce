'use client';

import { ProfileNav } from '@/components/profile/ProfileNav';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col pt-20 md:pt-28">
      {/* Left-Aligned Header Section within Centered Container */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 mb-2 animate-in fade-in slide-in-from-left-4 duration-700">
        <Link 
          href="/all" 
          className="group flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-all mb-4"
        >
          <ChevronLeft size={12} className="transition-transform group-hover:-translate-x-1" />
          Continue Shopping
        </Link>
        
        <div className="space-y-1">
          <h1 className="text-4xl sm:text-5xl tracking-tighter uppercase leading-none text-[#1A1614]">
            <span className="font-light">MY</span> <span className="font-extrabold">ACCOUNT</span>
          </h1>
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.4em]">
            Manage your settings & history
          </p>
        </div>
      </div>

      {/* Horizontal Navigation (Left Aligned within Centered Container) */}
      <ProfileNav />

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 pb-12 md:pb-20 mt-0 animate-in fade-in duration-1000">
        {children}
      </div>
      <Footer />
    </div>
  );
}
