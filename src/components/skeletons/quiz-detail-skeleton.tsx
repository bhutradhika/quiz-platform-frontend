import { Skeleton } from "@/components/ui/skeleton";

export function QuizDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="h-36 rounded-2xl bg-gray-100 animate-pulse" />

      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <Skeleton className="w-12 h-12 rounded-full mx-auto mb-3" />
            <Skeleton className="h-8 w-12 mx-auto" />
            <Skeleton className="h-4 w-16 mx-auto mt-1" />
          </div>
        ))}
      </div>

      <Skeleton className="h-14 w-full rounded-lg" />
    </div>
  );
}
