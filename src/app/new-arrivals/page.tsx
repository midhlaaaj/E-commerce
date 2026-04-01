import { createClient } from '@/lib/supabaseServer';
import CollectionClient from '@/components/collection/CollectionClient';
import { Footer } from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export default async function NewArrivalsPage() {
  const supabase = await createClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching new arrivals:', error);
  }

  return (
    <main className="min-h-screen bg-white">
      <CollectionClient 
        initialProducts={products || []} 
        title1="NEW"
        title2="ARRIVALS"
        subtitle="The latest 100 pieces from our curated archive"
        backLink="/"
        backLabel="BACK TO HOME"
      />
      <Footer />
    </main>
  );
}
