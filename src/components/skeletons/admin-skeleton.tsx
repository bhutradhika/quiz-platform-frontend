import { Skeleton } from "@/components/ui/skeleton";

export function AdminSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-36 rounded-2xl bg-gray-100 animate-pulse" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-16 mt-2" />
              </div>
              <Skeleton className="w-12 h-12 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      <div>
        <Skeleton className="h-7 w-36 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <Skeleton className="w-14 h-14 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48 mt-2" />
                </div>
                <Skeleton className="w-5 h-5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
