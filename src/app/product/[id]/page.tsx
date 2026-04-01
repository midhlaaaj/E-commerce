import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductReviews } from '@/components/product/ProductReviews';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { VisitTracker } from '@/components/product/VisitTracker';
import { createClient } from '@/lib/supabaseServer';
import { notFound } from 'next/navigation';

export const revalidate = 0; // Ensures data is always fresh

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  // Fetch product data with its category
  const { data: product, error } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .eq('id', id)
    .single();

  // Show generic 404 page if product doesn't exist or ID is faulty
  if (error || !product) {
    notFound();
  }

  // Fetch closely related products (same gender) omitting current product
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*')
    .eq('gender', product.gender)
    .neq('id', product.id)
    .limit(4);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
             <ProductGallery images={product.images || []} />
             <ProductInfo product={product} />
          </div>
        </div>
      </div>

      <div className="bg-[#FAF9F6] pb-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <ProductReviews />
          <RelatedProducts products={relatedProducts || []} />
        </div>
      </div>

      <VisitTracker productId={product.id} />
      <Footer />
    </main>
  );
}
