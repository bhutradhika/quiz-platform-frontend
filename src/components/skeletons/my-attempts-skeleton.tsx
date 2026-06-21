import { Skeleton } from "@/components/ui/skeleton";

export function MyAttemptsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-36 rounded-2xl bg-gray-100 animate-pulse" />

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b">
          <Skeleton className="h-4 w-12 col-span-2" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-12" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b last:border-b-0">
            <Skeleton className="h-5 w-40 col-span-2" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-6 w-20 rounded-lg" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
