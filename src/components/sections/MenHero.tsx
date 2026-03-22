import { Navbar } from '../layout/Navbar';

export const MenHero = () => {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-gray-100">
      <img 
        src="https://images.unsplash.com/photo-1488161628813-244aa2f87735?q=80&w=1964&auto=format&fit=crop" 
        alt="Men's Essentials"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start text-white">
        <span className="text-xs font-bold tracking-[0.3em] uppercase mb-4 animate-fade-in">
          SEASON LIMITED
        </span>
        <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tighter mb-8 max-w-2xl leading-[0.9] animate-slide-up">
          MEN'S<br />ESSENTIALS
        </h1>
        <button className="bg-[#D97706] text-white px-10 py-4 text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-black transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl">
          EXPLORE TRENDS
        </button>
      </div>
    </section>
  );
};
