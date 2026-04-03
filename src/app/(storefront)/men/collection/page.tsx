import { createClient } from '@/lib/supabaseServer';
import CollectionClient from '@/components/collection/CollectionClient';
import { Footer } from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export default async function MenCollectionPage() {
  const supabase = await createClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('gender', 'men')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('MenCollectionPage: Fetch error:', error);
  }

  // Map joined categories object if present
  const mappedProducts = (products || []).map(p => ({
    ...p,
    category: p.categories 
  }));

  return (
    <main className="min-h-screen bg-white">
      <CollectionClient 
        gender="men"
        initialProducts={mappedProducts}
        title1="MEN'S"
        title2="COLLECTION"
        subtitle="THE COMPLETE ARCHIVE"
        backLink="/men"
        backLabel="BACK TO MEN"
      />
      <Footer />
    </main>
  );
}
