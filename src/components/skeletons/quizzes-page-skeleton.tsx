import { Skeleton } from "@/components/ui/skeleton";

export function QuizzesPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-36 rounded-2xl bg-gray-100 animate-pulse" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <Skeleton className="w-5 h-5 rounded" />
            </div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-20" />
            <div className="mt-4 flex flex-wrap gap-1">
              <Skeleton className="h-6 w-16 rounded-lg" />
              <Skeleton className="h-6 w-20 rounded-lg" />
              <Skeleton className="h-6 w-18 rounded-lg" />
              <Skeleton className="h-6 w-18 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
