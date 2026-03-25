import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Sustainability = () => {
  return (
    <section className="py-12 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
      {/* Image Side */}
      <div className="flex-1 w-full relative">
        <div className="aspect-square bg-gray-200 rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1544441893-675973e306da?q=80&w=2070&auto=format&fit=crop"
            alt="Sustainability"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Floating element decorative */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#D97706]/10 rounded-3xl -z-10" />
      </div>

      {/* Content Side */}
      <div className="flex-1 space-y-8">
        <div className="space-y-4">
          <p className="text-xs font-bold text-[#D97706] tracking-[0.2em] uppercase">
            SUSTAINABILITY & ETHICS
          </p>
          <h2 className="text-4xl font-heading font-bold tracking-tight leading-tight uppercase">
            CRAFTED WITH CONSCIENCE
          </h2>
          <p className="text-gray-500 leading-relaxed text-sm lg:text-base">
            At EliteWear, we believe that luxury shouldn't come at a cost to our planet. Our garments are crafted using 100% organic cotton, recycled wool, and eco-friendly dyes. Every piece is a testament to longevity and timeless design.
          </p>
        </div>

        <div className="space-y-4">
          {[
            'Ethically sourced materials.',
            'Zero-waste manufacturing process.',
            'Carbon neutral shipping worldwide.'
          ].map((item) => (
            <div key={item} className="flex items-center gap-4 text-sm font-semibold text-gray-800">
              <CheckCircle2 className="w-5 h-5 text-[#D97706]" />
              {item}
            </div>
          ))}
        </div>

        <Button variant="outline" className="rounded-full px-10 py-6 border-black text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-all">
          LEARN MORE
        </Button>
      </div>
    </section>
  );
};
