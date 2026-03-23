import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { KidsHero } from '@/components/sections/KidsHero';
import { KidsCategories } from '@/components/sections/KidsCategories';
import { KidsProducts } from '@/components/sections/KidsProducts';
import { Newsletter } from '@/components/sections/Newsletter';

export default function KidsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <KidsHero />
      <KidsCategories />
      <KidsProducts />
      <Newsletter />
      <Footer />
    </main>
  );
}
