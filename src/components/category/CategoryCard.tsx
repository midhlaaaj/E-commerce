'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  id?: string;
  name: string;
  count?: number;
  imageUrl: string;
  href: string;
  className?: string;
}

export const CategoryCard = ({ 
  id, 
  name, 
  count, 
  imageUrl, 
  href, 
  className 
}: CategoryCardProps) => {
  return (
    <Link 
      href={href}
      className={cn("group block w-full", className)}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#F8F9FA] mb-5 shadow-sm hover:shadow-2xl transition-all duration-700">
        <Image 
          src={imageUrl || '/placeholder.jpg'}
          alt={name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Subtle Overlay on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-700" />
      </div>
      
      <div className="space-y-1.5">
        <h3 className="text-[12px] font-black tracking-[0.15em] uppercase text-[#2D2D2D] group-hover:text-[#D97706] transition-colors leading-tight">
          {name}
        </h3>
        {count !== undefined && (
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">
            {count} {count === 1 ? 'PIECE' : 'PIECES'}
          </p>
        )}
      </div>
    </Link>
  );
};
