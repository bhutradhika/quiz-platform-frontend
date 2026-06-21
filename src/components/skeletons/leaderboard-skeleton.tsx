import { Skeleton } from "@/components/ui/skeleton";

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-36 rounded-2xl bg-gray-100 animate-pulse" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <Skeleton className="h-5 w-28 mb-4" />
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <Skeleton className="h-5 w-32 mb-4" />
          <div className="flex flex-wrap gap-2">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-16 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="p-6 border-b">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="p-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-6 gap-4 p-4 border-b last:border-b-0 items-center"
            >
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
