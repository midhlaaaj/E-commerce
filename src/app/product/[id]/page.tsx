import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductReviews } from '@/components/product/ProductReviews';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { VisitTracker } from '@/components/product/VisitTracker';
import { ProductBreadcrumb } from '@/components/product/ProductBreadcrumb';
import { createClient } from '@/lib/supabaseServer';
import { getReviews } from '@/lib/actions/reviews';
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

  // Fetch product reviews
  const reviews = await getReviews(product.id);

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
      
      {/* Dynamic Navigation */}
      <ProductBreadcrumb gender={product.gender} />

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-24 items-start">
             <ProductGallery images={product.images || []} product={product} />
             <ProductInfo product={product} />
          </div>
        </div>
      </div>

      <div className="bg-white pb-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <ProductReviews productId={product.id} reviews={reviews} />
          <RelatedProducts products={relatedProducts || []} />
        </div>
      </div>

      <VisitTracker productId={product.id} />
      <Footer />
    </main>
  );
}
