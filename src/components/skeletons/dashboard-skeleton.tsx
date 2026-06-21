import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-36 rounded-2xl bg-gray-100 animate-pulse" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-violet-50 rounded-xl p-6 border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="w-10 h-10 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-24 mt-2" />
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-8 rounded-lg" />
              </div>
              <Skeleton className="h-4 w-16 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
