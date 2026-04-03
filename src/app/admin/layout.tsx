import { createAdminClient } from '@/lib/supabaseServer';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. INITIAL PASS-THROUGH
  if (!user) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  // 2. ROLE VERIFICATION
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // 3. RESTRICTED ACCESS UI (Minimalist Card)
  if (!profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-sm w-full text-center shadow-sm">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-sm text-gray-500 mb-8">
            Your account does not have administrative privileges to view this area.
          </p>
          
          <div className="space-y-3">
            <Link 
              href="/"
              className="block w-full py-3 px-4 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-medium transition-all"
            >
              Return to Store
            </Link>
            <Link 
              href="/login"
              className="block w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition-all"
            >
              Sign in with different account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. AUTHENTICATED ADMIN SHELL (Pure Minimal)
  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      <AdminSidebar user={user} profile={profile} />
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
