'use client';

import { cn } from '@/lib/utils';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-gray-100 rounded-md", className)} />
);

export const OrdersSkeleton = () => {
  return (
    <div className="space-y-12">



      {/* Full-Width Order Cards */}
      {[1, 2].map((i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
          {/* Header Skeleton */}
          <div className="bg-gray-50/80 px-8 py-6 flex items-center justify-between border-b border-gray-100">
            <div className="flex gap-8">
              <div className="space-y-2"><Skeleton className="h-2 w-16" /><Skeleton className="h-3 w-24" /></div>
              <div className="space-y-2"><Skeleton className="h-2 w-16" /><Skeleton className="h-3 w-20" /></div>
              <div className="space-y-2"><Skeleton className="h-2 w-16" /><Skeleton className="h-3 w-28" /></div>
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
          {/* Items Skeleton */}
          <div className="p-8 space-y-8">
            <div className="flex gap-8">
              <Skeleton className="w-24 h-32 rounded-xl" />
              <div className="flex-1 space-y-4 py-2">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-16 rounded-sm" />
                  <Skeleton className="h-6 w-16 rounded-sm" />
                </div>
                <div className="flex gap-4 pt-4">
                  <Skeleton className="h-2 w-20" />
                  <Skeleton className="h-2 w-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const AddressesSkeleton = () => {
  return (
    <div>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Address Button Skeleton */}
        <div className="p-8 border-2 border-dashed border-gray-50 rounded-3xl min-h-[220px] flex flex-col items-center justify-center gap-4">
          <Skeleton className="w-12 h-12 rounded-sm" />
          <Skeleton className="h-3 w-40" />
        </div>

        {/* Saved Address Card Skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-8 border border-gray-100 rounded-3xl min-h-[220px] space-y-6">
            <div className="flex justify-between items-center">
              <Skeleton className="w-8 h-8 rounded-sm" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SidebarSkeleton = () => {
  return (
    <div className="space-y-8">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 px-4">
          <Skeleton className="w-5 h-5 rounded-md" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
};
