'use client';

import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D97706]" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col pt-24 md:pt-32">
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 pb-20">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Left Sidebar */}
          <aside className="w-full md:w-64 md:sticky md:top-32 h-fit">
            <div className="mb-10 px-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-2">My Account</p>
              <h1 className="text-4xl font-extrabold tracking-tighter uppercase text-[#1A1614]">
                Settings
              </h1>
            </div>
            <ProfileSidebar />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <div className="py-2">
              {children}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
