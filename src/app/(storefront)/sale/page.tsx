import { createClient } from '@/lib/supabaseServer';
import CollectionClient from '@/components/collection/CollectionClient';
import { Footer } from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export default async function SalePage() {
  const supabase = await createClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
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
        initialProducts={saleProducts} 
        title1="ON"
        title2="SALE"
        subtitle="EXCLUSIVE ARCHIVE REDUCTIONS"
        backLink="/"
        backLabel="BACK TO HOME"
      />
      <Footer />
    </main>
  );
}
