import { createClient } from '@/lib/supabaseServer';
import CollectionClient from '@/components/collection/CollectionClient';
import { Footer } from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export default async function GenderSalePage({ params }: { params: Promise<{ gender: string }> }) {
  const { gender } = await params;
  const supabase = await createClient();
  
  const genderFilter = (gender === 'men' || gender === 'women') ? [gender, 'unisex'] : [gender];

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .in('gender', genderFilter)
    .not('offer_price', 'is', null);

  if (error) {
    console.error('Error fetching sale products:', error);
  }

  // Double check client side with robust type casting
  const saleProducts = (products || []).filter(p => {
    const price = Number(p.price);
    const offerPrice = p.offer_price ? Number(p.offer_price) : null;
    return offerPrice !== null && offerPrice < price;
  });

  return (
    <main className="min-h-screen bg-white">
      <CollectionClient 
        gender={gender}
        initialProducts={saleProducts} 
        title1={`${gender.toUpperCase()}'S`}
        title2="SALE"
        subtitle={`Exclusive archive reductions on ${gender} pieces`}
        backLink={`/${gender}`}
        backLabel={`BACK TO ${gender.toUpperCase()}`}
      />
      <Footer />
    </main>
  );
}
