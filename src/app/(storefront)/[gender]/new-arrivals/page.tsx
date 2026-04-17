import { createClient } from '@/lib/supabaseServer';
import CollectionClient from '@/components/collection/CollectionClient';
import { Footer } from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export default async function GenderNewArrivalsPage({ params }: { params: Promise<{ gender: string }> }) {
  const { gender } = await params;
  const supabase = await createClient();
  
  const genderFilter = (gender === 'men' || gender === 'women') ? [gender, 'unisex'] : [gender];

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .in('gender', genderFilter)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching new arrivals:', error);
  }

  return (
    <main className="min-h-screen bg-white">
      <CollectionClient 
        gender={gender}
        initialProducts={products || []} 
        title1={`${gender.toUpperCase()}'S NEW`}
        title2="ARRIVALS"
        subtitle={`The latest 100 ${gender} pieces from our archive`}
        backLink={`/${gender}`}
        backLabel={`BACK TO ${gender.toUpperCase()}`}
      />
      <Footer />
    </main>
  );
}
