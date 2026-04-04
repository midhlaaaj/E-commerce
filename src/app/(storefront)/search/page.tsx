import SearchClient from '@/components/search/SearchClient';

export const metadata = {
  title: 'Search | ELITEWEAR',
  description: 'Search for brands, products, and categories.',
};

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-white">
      <SearchClient />
    </main>
  );
}
