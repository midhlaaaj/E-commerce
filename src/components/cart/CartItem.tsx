'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType, useCartStore } from '@/store/use-cart-store';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-6 py-8 border-b border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link 
        href={`/product/${item.id}`}
        className="relative w-24 h-32 md:w-32 md:h-40 bg-[#F8F9FA] flex-shrink-0 group block overflow-hidden"
      >
        <Image
          src={item.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop'}
          alt={item.name}
          fill
          className="object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
        />
      </Link>

      {/* Product Details */}
      <div className="flex flex-col flex-1 py-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <Link href={`/product/${item.id}`}>
              <h3 className="text-[13px] font-black uppercase tracking-wider text-[#2D2D2D] mb-1 hover:text-[#D97706] transition-colors cursor-pointer">
                {item.name}
              </h3>
            </Link>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Size: {item.size}
            </p>
          </div>
          <p className="text-[13px] font-black text-[#D97706]">
            ₹{item.price.toLocaleString()}
          </p>
        </div>

        <div className="mt-auto flex justify-between items-center">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-200">
            <button
              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
              className="px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              <Minus size={12} />
            </button>
            <span className="w-10 text-center text-[11px] font-bold">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
              className="px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => removeItem(item.id, item.size)}
            className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors group"
          >
            <Trash2 size={12} className="group-hover:scale-110 transition-transform" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};
