import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { KidsHero } from '@/components/sections/KidsHero';
import { KidsCategories } from '@/components/sections/KidsCategories';
import { KidsProducts } from '@/components/sections/KidsProducts';
import { Newsletter } from '@/components/sections/Newsletter';
import { createClient } from '@/lib/supabaseServer';

export default async function KidsPage() {
  const supabase = await createClient();

  // Parallel fetch for Kids' content
  const [heroResponse, categoriesResponse, productsResponse] = await Promise.all([
    supabase.from('homepage_content').select('*').eq('section_key', 'kids_hero').single(),
    supabase.from('categories').select('*').eq('gender', 'kids').order('created_at', { ascending: false }),
    supabase.from('products').select('*').eq('gender', 'kids').limit(6)
  ]);

  const heroData = heroResponse.data;
  const categoriesData = categoriesResponse.data || [];
  const productsData = productsResponse.data || [];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <KidsHero initialData={heroData} />
      <KidsCategories initialData={categoriesData} />
      <KidsProducts initialData={productsData} />
      <Newsletter />
      <Footer />
    </main>
  );
}
