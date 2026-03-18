import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Newsletter = () => {
  return (
    <section className="bg-[#0A0D11] py-24 px-6 text-center text-white">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight uppercase">
            JOIN THE ELITE CIRCLE
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Subscribe to receive styling alerts, limited collection drops and exclusive fashion content.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <Input 
            type="email" 
            placeholder="Your email address" 
            className="h-14 bg-white/5 border-white/10 text-white rounded-full px-8 text-xs focus-visible:ring-[#D97706]"
          />
          <Button className="h-14 bg-[#D97706] hover:bg-[#B45309] text-white px-10 rounded-full text-xs font-bold tracking-widest transition-all">
            SUBSCRIBE
          </Button>
        </div>
      </div>
    </section>
  );
};
