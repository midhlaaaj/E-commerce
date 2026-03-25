'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title1: string;
  title2: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaOnClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export const SectionHeader = ({
  title1,
  title2,
  subtitle,
  ctaText,
  ctaLink,
  ctaOnClick,
  className
}: SectionHeaderProps) => {
  const ctaClasses = "text-[10px] font-extrabold text-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-300 transition-all sm:mb-1";

  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-6", className)}>
      <div className="space-y-2">
        <h2 className="text-4xl text-[#1A1614] tracking-tight uppercase leading-none">
          <span className="font-light">{title1}</span> <span className="font-extrabold">{title2}</span>
        </h2>
        {subtitle && (
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">
            {subtitle}
          </p>
        )}
      </div>
      {ctaText && (
        <>
          {ctaOnClick ? (
            <button onClick={ctaOnClick} className={ctaClasses}>
              {ctaText}
            </button>
          ) : ctaLink ? (
            <Link href={ctaLink} className={ctaClasses}>
              {ctaText}
            </Link>
          ) : null}
        </>
      )}
    </div>
  );
};
