import { createClient } from '@/lib/supabaseServer';
import { notFound } from 'next/navigation';
import CollectionClient from '@/components/collection/CollectionClient';
import { Footer } from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ gender: string; category: string }>;
}

export default async function GenderCategoryPage({ params }: Props) {
  const { gender, category: categorySlug } = await params;
  
  // Guard against non-standard genders and system routes
  const validGenders = ['men', 'women', 'kids'];
  if (!validGenders.includes(gender.toLowerCase())) {
    // If it's a system route like 'profile', we should not return notFound here
    // as it might be handled by a more specific static route.
    // However, if we reached here, it means no static route matched.
    // We only return notFound if it's definitely NOT one of our genders.
    return notFound();
  }

  // Convert slug back to readable name for query (e.g. suits-&-blazers -> SUITS & BLAZERS)
  // This is a simple reversal, but the query should be broad.
  const categoryName = categorySlug.replace(/-/g, ' ').toUpperCase();
  
  const supabase = await createClient();

  // 1. Fetch category definition to get exact ID
  let { data: categoryData } = await supabase
    .from('categories')
    .select('id, name')
    .ilike('name', categoryName)
    .in('gender', [gender, 'unisex'])
    .single();

  if (!categoryData) {
    // If not found by exact match, try a more flexible search
    const { data: categoryList } = await supabase
      .from('categories')
      .select('id, name')
      .in('gender', [gender, 'unisex']);
      
    // Find matching category by slugging its name locally
    const matched = categoryList?.find(c => 
      c.name.toLowerCase().replace(/\s+/g, '-') === categorySlug.toLowerCase()
    );
    
    if (!matched) return notFound();
    categoryData = matched;
  }

  // 2. Fetch products for this category and gender
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .in('gender', [gender, 'unisex'])
    .eq('category_id', categoryData.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching category collection:', error);
  }

  return (
    <main className="min-h-screen bg-white">
      <CollectionClient 
        gender={gender}
        categoryName={categoryData.name}
        initialProducts={products || []} 
        title1={gender.toUpperCase()}
        title2={categoryData.name.toUpperCase()}
        subtitle={`CURATED SELECTION OF ${categoryData.name.toUpperCase()}`}
        backLink={`/${gender}`}
        backLabel={`BACK TO ${gender.toUpperCase()}`}
      />
      <Footer />
    </main>
  );
}
