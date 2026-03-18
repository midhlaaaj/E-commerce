import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Categories } from '@/components/sections/Categories';
import { FeaturedProducts } from '@/components/sections/FeaturedProducts';
import { TrendingNow } from '@/components/sections/TrendingNow';
import { Sustainability } from '@/components/sections/Sustainability';
import { Newsletter } from '@/components/sections/Newsletter';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <div className="bg-[#F3F4F6] py-2">
        <TrendingNow />
      </div>
      <Sustainability />
      <Newsletter />
      <Footer />
    </main>
  );
}
