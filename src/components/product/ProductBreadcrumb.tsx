'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export const ProductBreadcrumb = ({ gender }: { gender?: string }) => {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-8">
      <button 
        onClick={() => router.back()}
        className="group flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-all"
      >
        <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
        <span>CONTINUE SHOPPING</span>
      </button>
    </div>
  );
};
