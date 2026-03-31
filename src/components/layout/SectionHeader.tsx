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
  icon?: React.ReactNode;
}

export const SectionHeader = ({
  title1,
  title2,
  subtitle,
  ctaText,
  ctaLink,
  ctaOnClick,
  className,
  icon
}: SectionHeaderProps) => {
  const ctaClasses = "flex items-center gap-2 text-[10px] font-bold text-[#D97706] uppercase tracking-[0.2em] hover:text-black transition-all group/cta";

  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-6 px-1", className)}>
      <div className="space-y-1">
        <h2 className="text-4xl sm:text-5xl text-[#1A1614] tracking-tighter uppercase leading-none">
          <span className="font-light">{title1}</span> <span className="font-extrabold">{title2}</span>
        </h2>
        {subtitle && (
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">
            {subtitle}
          </p>
        )}
      </div>
      {ctaText && (
        <div className="flex items-center">
          {ctaOnClick ? (
            <button onClick={ctaOnClick} className={ctaClasses}>
              {icon && <span className="transition-transform group-hover/cta:scale-110">{icon}</span>}
              <span className="border-b border-[#D97706]/30 group-hover/cta:border-black pb-1">{ctaText}</span>
            </button>
          ) : ctaLink ? (
            <Link href={ctaLink} className={ctaClasses}>
              {icon && <span className="transition-transform group-hover/cta:scale-110">{icon}</span>}
              <span className="border-b border-[#D97706]/30 group-hover/cta:border-black pb-1">{ctaText}</span>
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
};
