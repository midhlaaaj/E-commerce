import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Newsletter = () => {
  return (
    <section className="bg-[#F3F4F6] py-12 px-6">
      <div className="max-w-7xl mx-auto bg-white p-12 md:p-20 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1A1614] leading-none uppercase">
              JOIN THE ARCHIVE
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-md leading-relaxed">
              Receive early access to seasonal collections, private sales, and the digital periodical.
            </p>
          </div>

          {/* Right Form */}
          <div className="w-full md:w-[400px] flex flex-col gap-4">
            <Input 
              type="email" 
              placeholder="ENTER YOUR EMAIL" 
              className="h-16 bg-[#F9FAFB] border-none text-sm font-medium tracking-widest px-8 rounded-md placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-200"
            />
            <Button className="h-16 bg-[#1A1614] hover:bg-black text-white text-xs font-bold tracking-[0.2em] rounded-md transition-all uppercase px-12">
              SUBSCRIBE NOW
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
