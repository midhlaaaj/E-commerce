'use client';

import { useState } from 'react';
import { ShoppingBag, Truck, RotateCcw, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/use-cart-store';

export const ProductInfo = ({ product }: { product: any }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  
  const categoryName = product?.category?.name || product?.categories?.name || 'COLLECTION';
  
  // Split name for archival look (First word light, rest bold)
  const nameParts = product.name.split(' ');
  const firstWord = nameParts[0];
  const restOfName = nameParts.slice(1).join(' ');

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      alert('Please select a size');
      return;
    }
    
    // Add to cart (existing store logic adds 1 at a time)
    for (let i = 0; i < quantity; i++) {
        addItem(product, selectedSize || 'One Size');
    }
  };

  return (
    <div className="flex flex-col">
      {/* Category / Gender Label */}
      <div className="flex items-center gap-2 text-[9px] font-black text-[#D97706] tracking-[0.3em] uppercase mb-6">
        <span>{product.gender}</span>
        <ChevronRight size={8} />
        <span>{categoryName}</span>
      </div>

      {/* Product Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter uppercase leading-none text-[#1A1614] mb-8">
        <span className="font-light block sm:inline">{firstWord}</span> <span className="font-extrabold">{restOfName}</span>
      </h1>
      
      {/* Price Section */}
      <div className="flex items-baseline gap-4 mb-10 border-b border-gray-100 pb-8">
        <span className={cn(
          "text-2xl font-bold tracking-tight",
          product.offer_price ? "text-gray-300 line-through text-lg" : "text-[#1A1614]"
        )}>
          ₹{Number(product.price).toLocaleString()}
        </span>
        {product.offer_price && (
          <span className="text-3xl font-black text-[#D97706] tracking-tight">
            ₹{Number(product.offer_price).toLocaleString()}
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="ml-auto text-[9px] font-black tracking-widest text-red-500 uppercase bg-red-50 px-2 py-1">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Description */}
      <div className="mb-12">
        <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 mb-4">Description</h3>
        <p className="text-[#1A1614] text-xs font-medium leading-relaxed max-w-lg">
          {product.description || "A masterfully crafted piece designed for the modern wardrobe. Features premium fabrication and a silhouette that balances timeless appeal with contemporary precision."}
        </p>
      </div>

      {/* Size Selection */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#1A1614]">Select Size</h3>
          <button className="text-[9px] font-bold text-gray-400 hover:text-black uppercase tracking-widest transition-colors underline underline-offset-4">
            Size Guide
          </button>
        </div>
        
        <div className="flex gap-2.5 flex-wrap">
          {product.sizes?.length > 0 ? product.sizes.map((size: string) => (
            <button 
              key={size}
              onClick={() => setSelectedSize(size)}
              className={cn(
                "w-14 h-14 text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                selectedSize === size 
                  ? "bg-[#1A1614] text-white" 
                  : "bg-white border border-gray-100 text-[#1A1614] hover:border-black"
              )}
            >
              {size}
            </button>
          )) : (
            <button className="px-6 h-14 bg-[#1A1614] text-white text-[11px] font-black uppercase tracking-widest">
              ONE SIZE
            </button>
          )}
        </div>
      </div>

      {/* Quantity & Add to Cart */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <div className="flex items-center bg-gray-50 h-16 px-6 sm:w-40 justify-between">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="text-lg text-gray-400 hover:text-black transition-colors px-2"
          >
            −
          </button>
          <span className="text-sm font-black w-8 text-center">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="text-lg text-gray-400 hover:text-black transition-colors px-2"
          >
            +
          </button>
        </div>

        <button 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={cn(
            "flex-1 h-16 flex items-center justify-center gap-4 transition-all duration-500 group relative overflow-hidden",
            product.stock === 0 
              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
              : "bg-[#1A1614] text-white hover:bg-black active:scale-[0.98]"
          )}
        >
          <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </span>
        </button>
      </div>

      {/* Benefits / Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-100 border border-gray-100">
        <div className="bg-white p-6 flex items-start gap-4">
          <Truck size={20} className="text-[#D97706] mt-0.5" />
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1A1614] mb-1">Shipping</h4>
            <p className="text-[10px] font-medium text-gray-400 uppercase leading-normal">Express delivery available on all archival pieces.</p>
          </div>
        </div>
        <div className="bg-white p-6 flex items-start gap-4">
          <RotateCcw size={20} className="text-[#D97706] mt-0.5" />
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1A1614] mb-1">Returns</h4>
            <p className="text-[10px] font-medium text-gray-400 uppercase leading-normal">30-day effortless returns policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
