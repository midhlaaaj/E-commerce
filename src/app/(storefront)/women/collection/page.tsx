import { createClient } from '@/lib/supabaseServer';
import CollectionClient from '@/components/collection/CollectionClient';
import { Footer } from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export default async function WomenCollectionPage() {
  const supabase = await createClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('gender', 'women')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('WomenCollectionPage: Fetch error:', error);
  }

  // Map joined categories object if present
  const mappedProducts = (products || []).map(p => ({
    ...p,
    category: p.categories 
  }));

  return (
    <main className="min-h-screen bg-white">
      <CollectionClient 
        gender="women"
        initialProducts={mappedProducts}
        title1="WOMEN'S"
        title2="COLLECTION"
        subtitle="THE COMPLETE ARCHIVE"
        backLink="/women"
        backLabel="BACK TO WOMEN"
      />
      <Footer />
    </main>
  );
}
