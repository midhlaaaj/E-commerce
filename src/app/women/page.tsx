import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WomenHero } from '@/components/sections/WomenHero';
import { WomenCategories } from '@/components/sections/WomenCategories';
import { WomenProducts } from '@/components/sections/WomenProducts';
import { Newsletter } from '@/components/sections/Newsletter';

export default function WomenPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <WomenHero />
      <WomenCategories />
      <WomenProducts />
      <Newsletter />
      <Footer />
    </main>
  );
}
