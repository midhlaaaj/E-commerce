import { Button } from '@/components/ui/button';

export const Hero = () => {
  return (
    <section className="relative h-[80vh] md:h-[90vh] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')`,
          filter: 'brightness(0.7)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <p className="text-[10px] md:text-sm font-semibold tracking-[0.3em] uppercase mb-4 opacity-90">
          WINTER 2024 COLLECTION
        </p>
        <h1 className="text-4xl md:text-7xl font-heading font-bold tracking-tight mb-6 leading-[1.1]">
          THE ART OF <br /> MODERN ELEGANCE
        </h1>
        <p className="text-sm md:text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
          Redefining luxury through minimalist design and sustainably sourced premium fabrics.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button className="bg-[#D97706] hover:bg-[#B45309] text-white px-8 py-6 rounded-full text-xs font-bold tracking-widest min-w-[200px] transition-all">
            SHOP COLLECTION
          </Button>
          <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white px-8 py-6 rounded-full text-xs font-bold tracking-widest min-w-[200px] backdrop-blur-sm transition-all">
            VIEW LOOKBOOK
          </Button>
        </div>
      </div>
    </section>
  );
};
