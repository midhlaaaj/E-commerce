import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductReviews } from '@/components/product/ProductReviews';
import { RelatedProducts } from '@/components/product/RelatedProducts';

export default function ProductPage() {
  const sampleProduct = {
    id: 'sample-1',
    name: 'ELITE SIGNATURE PARKA',
    price: 12999,
    offer_price: 8999,
    description: 'A masterpiece of contemporary outerwear, this parka combines technical precision with high-fashion aesthetics. Features water-resistant premium nylon and a sharp, industrial silhouette.',
    gender: 'MEN',
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1964&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544022613-e87ce71c85b9?q=80&w=1974&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    category: { name: 'OUTERWEAR' }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
             <ProductGallery images={sampleProduct.images} />
             <ProductInfo product={sampleProduct} />
          </div>
        </div>
      </div>

      <div className="bg-[#FAF9F6] pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <ProductReviews />
          <RelatedProducts />
        </div>
      </div>

      <Footer />
    </main>
  );
}
