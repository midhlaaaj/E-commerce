import { createAdminClient } from '@/lib/supabaseServer';
import DashboardClient from './DashboardClient';
import { ShoppingBag, Tag, Users, TrendingUp } from 'lucide-react';

export default async function AdminPage() {
  const supabase = await createAdminClient();

  // Fetch initial stats on the server
  const [{ count: productCount }, { count: categoryCount }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
  ]);

  const stats = [
    { name: 'Total Products', value: (productCount || 0).toString(), iconId: 'products', change: `+${productCount || 0}`, changeType: productCount ? 'increase' : 'neutral' },
    { name: 'Active Categories', value: (categoryCount || 0).toString(), iconId: 'categories', change: `+${categoryCount || 0}`, changeType: 'neutral' },
    { name: 'Store Visits', value: '2.4k', iconId: 'visits', change: '+12%', changeType: 'increase' },
    { name: 'Revenue', value: '₹0', iconId: 'revenue', change: '0', changeType: 'neutral' },
  ];

  return <DashboardClient initialStats={stats} />;
}
