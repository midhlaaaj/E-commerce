import { createClient } from '@/lib/supabaseServer';
import CollectionClient from '@/components/collection/CollectionClient';
import { Footer } from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export default async function AllProductsPage() {
  const supabase = await createClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('AllProductsPage: Fetch error:', error);
  }

  // Map joined categories object if present
  const mappedProducts = (products || []).map(p => ({
    ...p,
    category: p.categories 
  }));

  return (
    <main className="min-h-screen bg-white">
      <CollectionClient 
        initialProducts={mappedProducts}
        title1="THE ENTIRE"
        title2="ARCHIVE"
        subtitle="ELITE SELECTION"
        backLink="/"
        backLabel="BACK TO HOME"
      />
      <Footer />
    </main>
  );
}
