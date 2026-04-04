import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export const Sustainability = () => {
  return (
    <section className="py-12 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-20 border-t border-black/[0.03]">
      {/* Image Side */}
      <div className="flex-[0.8] w-full relative max-w-md mx-auto md:mx-0">
        <div className="aspect-square bg-gray-200 rounded-sm overflow-hidden shadow-xl relative">
          <Image 
            src="/conscience.jpg"
            alt="Sustainability"
            fill
            className="object-cover"
          />
        </div>
        {/* Floating element decorative */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#D97706]/10 rounded-sm -z-10" />
      </div>

      {/* Content Side */}
      <div className="flex-[1.2] space-y-8">

        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl text-[#1A1614] tracking-tighter uppercase leading-none">
            <span className="font-light">CRAFTED WITH</span> <br />
            <span className="font-extrabold text-5xl sm:text-6xl">CONSCIENCE</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">
            SUSTAINABILITY & ETHICS
          </p>
          <p className="text-gray-500 leading-relaxed text-sm lg:text-base pt-4">
            At EliteWear, we believe that luxury shouldn't come at a cost to our planet. Our garments are crafted using 100% organic cotton, recycled wool, and eco-friendly dyes. Every piece is a testament to longevity and timeless design.
          </p>
        </div>

        <div className="space-y-4">
          {[
            'Ethically sourced materials.',
            'Zero-waste manufacturing process.',
            'Carbon neutral shipping worldwide.'
          ].map((item) => (
            <div key={item} className="flex items-center gap-4 text-[10px] font-bold text-[#1A1614] uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4 text-[#D97706]" />
              {item}
            </div>
          ))}
        </div>

        <Button variant="outline" className="rounded-none px-12 py-6 border-black text-[10px] font-bold tracking-[0.2em] hover:bg-black hover:text-white transition-all active:scale-95">
          LEARN MORE
        </Button>
      </div>
    </section>
  );
};

