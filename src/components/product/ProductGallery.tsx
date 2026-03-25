'use client';
import { useState } from 'react';

export const ProductGallery = ({ images = [] }: { images?: string[] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainImage = images[selectedIndex] || 'https://images.unsplash.com/photo-1581001479836-eeb2956cf2eb?q=80&w=1964&auto=format&fit=crop';

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full aspect-[4/5] bg-[#E8EAE6] rounded-[2rem] overflow-hidden flex items-center justify-center relative p-8">
        <button className="absolute top-6 right-6 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700">
             <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <img 
          src={mainImage} 
          alt="Product Main" 
          className="w-full h-full object-cover rounded-xl transition-all duration-300"
        />
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-4">
          {images.slice(0, 4).map((img, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedIndex(idx)}
              className={`w-20 h-24 rounded-xl border-2 p-1 bg-[#F5F5F5] overflow-hidden cursor-pointer transition-all ${selectedIndex === idx ? 'border-[#D97706]' : 'border-transparent hover:border-gray-200'}`}
            >
               <img src={img} alt={`thumb${idx}`} className="w-full h-full object-cover rounded-lg" />
            </div>
          ))}
          {images.length > 4 && (
            <div className="w-20 h-24 rounded-xl bg-[#F0F2F5] relative overflow-hidden cursor-pointer flex items-center justify-center">
               <span className="text-gray-500 font-bold text-lg">+{images.length - 4}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
