'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthLayoutWrapperProps {
  children: React.ReactNode;
  title1: string;
  title2: string;
  subtitle: string;
  imageSide?: 'left' | 'right';
  imageUrl?: string;
}

export function AuthLayoutWrapper({
  children,
  title1,
  title2,
  subtitle,
  imageSide = 'left',
  imageUrl = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop'
}: AuthLayoutWrapperProps) {
  return (
    <div className="min-h-screen w-full bg-[#fcfcfc] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Editorial Background Element (Crystal Blur) */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
      
      {/* Large Branded Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none z-0">
        <h1 className="text-[25vw] font-black tracking-tighter italic leading-none">ELITE</h1>
      </div>

      {/* The Floating Card */}
      <div className="w-full max-w-[500px] relative z-10 animate-in fade-in zoom-in-95 duration-1000 fill-mode-both">
        <div className="bg-white shadow-[0_48px_120px_-24px_rgba(0,0,0,0.12)] border border-black/[0.04] p-12 md:p-20 flex flex-col items-center">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group mb-16 transition-all hover:opacity-70 active:scale-95">
            <div className="w-7 h-7 flex items-center justify-center rounded-sm bg-black shadow-lg">
              <span className="font-bold text-lg italic text-white leading-none">E</span>
            </div>
            <span className="font-heading font-black text-lg tracking-tighter text-black uppercase">ELITEWEAR</span>
          </Link>

          {/* Branded Header */}
          <header className="w-full text-center space-y-4 mb-14">
             <p className="text-[9px] font-black text-black/40 uppercase tracking-[0.6em] ml-1">{subtitle}</p>
             <div className="flex flex-col items-center justify-center leading-[0.85]">
                <h1 className="text-[52px] font-thin tracking-tight uppercase text-black">
                  {title1}
                </h1>
                <h1 className="text-[52px] font-black tracking-tighter uppercase text-black -mt-1">
                  {title2}
                </h1>
             </div>
          </header>

          <main className="w-full">
            {children}
          </main>

          <footer className="mt-16 w-full pt-10 border-t border-black/5">
            <div className="flex items-center justify-center gap-4 opacity-15">
              <ShieldCheck size={12} className="text-black" />
              <span className="text-[8px] font-black text-black uppercase tracking-[0.5em]">Auth Terminal v2.1</span>
            </div>
          </footer>
        </div>
        
        {/* Modern Footer Meta */}
        <div className="mt-10 flex items-center justify-between px-4 opacity-20 pointer-events-none select-none">
           <span className="text-[7px] font-black tracking-[0.6em] uppercase">Private Encryption Standard</span>
           <span className="text-[7px] font-black tracking-[0.6em] uppercase">© 2024 ELITEWEAR</span>
        </div>
      </div>
    </div>
  );
}
