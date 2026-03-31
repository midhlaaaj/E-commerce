import { createClient } from '@/lib/supabaseServer';
import { notFound } from 'next/navigation';
import CollectionClient from '@/components/collection/CollectionClient';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

interface Props {
  params: Promise<{ gender: string }>;
}

export default async function CollectionPage({ params }: Props) {
  const { gender } = await params;
  
  if (!['men', 'women', 'kids'].includes(gender)) {
    return notFound();
  }

  const supabase = await createClient();

  // Fetch all products for the given gender
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name),
      categories(name)
    `)
    .eq('gender', gender)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching collection:', error);
  }

  return (
    <main className="min-h-screen bg-white font-body selection:bg-black selection:text-white">
      <Navbar />
      <CollectionClient gender={gender} initialProducts={products || []} />
      <Footer />
    </main>
  );
}
