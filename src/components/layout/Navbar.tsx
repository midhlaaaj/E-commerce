'use client';

import Link from 'next/link';
import { Search, Heart, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-black flex items-center justify-center rounded-sm">
          <span className="text-white font-bold text-xl italic">E</span>
        </div>
        <span className="font-heading font-bold text-xl tracking-tighter">ELITEWEAR</span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8 ml-10">
        {['MEN', 'WOMEN', 'KIDS', 'NEW ARRIVALS'].map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase().replace(' ', '-')}`}
            className="text-xs font-semibold tracking-widest text-gray-800 hover:text-black transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>

      {/* Search and Icons */}
      <div className="flex items-center gap-6 flex-1 justify-end max-w-md">
        <div className="relative w-full max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search collection..."
            className="pl-10 h-10 bg-gray-50 border-none rounded-full text-xs"
          />
        </div>
        <Heart className="w-5 h-5 text-gray-700 cursor-pointer hover:text-black transition-colors" />
        <div className="relative cursor-pointer group">
          <ShoppingBag className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors" />
          <Badge className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center p-0 rounded-full">
            0
          </Badge>
        </div>
      </div>
    </nav>
  );
};
