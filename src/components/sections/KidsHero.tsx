export const KidsHero = () => {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-gray-100">
      <img 
        src="/assets/kids_hero.png" 
        alt="Kids' Playful Comfort"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start text-white">
        <span className="text-xs font-bold tracking-[0.3em] uppercase mb-4 animate-fade-in">
          THE EDITORIAL SERIES / 08
        </span>
        <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tighter mb-8 max-w-2xl leading-[0.9] animate-slide-up">
          KIDS'<br />PLAYFUL<br />COMFORT
        </h1>
        <p className="text-sm md:text-base font-medium max-w-xl mb-10 leading-relaxed opacity-90 animate-slide-up">
          Discover a world of cozy textures and durable silhouettes designed for the next generation of style explorers.
        </p>
        <button className="bg-[#D97706] text-white px-10 py-4 text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-black transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl">
          SHOP THE COLLECTION
        </button>
      </div>
    </section>
  );
};
