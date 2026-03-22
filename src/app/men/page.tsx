import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MenHero } from '@/components/sections/MenHero';
import { MenCategories } from '@/components/sections/MenCategories';
import { MenProducts } from '@/components/sections/MenProducts';
import { Newsletter } from '@/components/sections/Newsletter';

export default function MenPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <MenHero />
      <MenCategories />
      <MenProducts />
      <Newsletter />
      <Footer />
    </main>
  );
}
