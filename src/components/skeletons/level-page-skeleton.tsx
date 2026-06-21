import { Skeleton } from "@/components/ui/skeleton";

export function LevelPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-36 rounded-2xl bg-gray-100 animate-pulse" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-1" />
            <div className="flex items-center justify-between mt-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="w-4 h-4 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
