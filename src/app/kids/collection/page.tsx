import { createClient } from '@/lib/supabaseServer';
import CollectionClient from '@/components/collection/CollectionClient';
import { Footer } from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export default async function KidsCollectionPage() {
  const supabase = await createClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('gender', 'kids')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('KidsCollectionPage: Fetch error:', error);
  }

  // Map joined categories object if present
  const mappedProducts = (products || []).map(p => ({
    ...p,
    category: p.categories 
  }));

  return (
    <main className="min-h-screen bg-white">
      <CollectionClient 
        gender="kids"
        initialProducts={mappedProducts}
        title1="KIDS'"
        title2="COLLECTION"
        subtitle="THE COMPLETE ARCHIVE"
        backLink="/kids"
        backLabel="BACK TO KIDS"
      />
      <Footer />
    </main>
  );
}
