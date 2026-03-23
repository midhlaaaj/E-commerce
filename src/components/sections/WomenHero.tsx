export const WomenHero = () => {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-[#FDF2F0]">
      <img 
        src="/assets/women_hero.png" 
        alt="Women's Essentials"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
      
      <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start">
        <span className="text-xs font-bold tracking-[0.3em] uppercase mb-4 text-[#D97706] animate-fade-in">
          THE SPRING 2024
        </span>
        <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tighter mb-8 max-w-2xl leading-[0.9] text-gray-900 animate-slide-up">
          WOMEN'S<br />ESSENTIALS
        </h1>
        <p className="text-sm text-gray-600 max-w-md mb-8 leading-relaxed font-medium">
          A curated collection of timeless silhouettes, crafted from the finest materials for the discerning modern woman.
        </p>
        <button className="bg-[#D97706] text-white px-10 py-4 text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-black transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl">
          EXPLORE THE EDIT
        </button>
      </div>
    </section>
  );
};
