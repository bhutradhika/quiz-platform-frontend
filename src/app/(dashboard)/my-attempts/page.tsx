"use client";

import { MyAttemptsSkeleton } from "@/components/skeletons";
import { formatDateTime } from "@/lib/format";
import { attemptService } from "@/services/attempt";
import { Attempt, PagedResponse } from "@/types";
import { ChevronLeft, ChevronRight, History } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyAttemptsPage() {
  const [attempts, setAttempts] = useState<PagedResponse<Attempt> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const response = await attemptService.getMyAttempts(page, 10);
      if (cancelled) return;
      if (response.success && response.data) {
        setAttempts(response.data);
      }
      setIsLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [page]);

  const getStatusBadge = (attempt: Attempt) => {
    if (attempt.completedAt) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
        In Progress
      </span>
    );
  };

  if (isLoading) {
    return <MyAttemptsSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-500 to-teal-600 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">My Attempts</h1>
          <p className="text-emerald-100 text-lg">Track your quiz history and performance</p>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
          <History className="w-32 h-32" />
        </div>
      </div>

      {attempts && attempts.content.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-4 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-b">
            <div className="col-span-2">Quiz</div>
            <div>Score</div>
            <div>Status</div>
            <div>Date</div>
          </div>
          <div className="divide-y">
            {attempts.content.map((attempt) => (
              <Link
                key={attempt.id}
                href={`/quizzes/${attempt.category.toLowerCase()}/${attempt.level.toLowerCase()}/${attempt.quizId}`}
                className="grid grid-cols-5 gap-4 p-4 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-2">
                  <p className="font-medium text-gray-900">{attempt.quizTitle}</p>
                </div>
                <div>
                  <span className="font-semibold text-purple-600">{attempt.score.toFixed(0)}</span>
                  <span className="text-gray-400">/{attempt.maxScore.toFixed(0)}</span>
                </div>
                <div>{getStatusBadge(attempt)}</div>
                <div className="text-sm text-gray-500">
                  {attempt.completedAt
                    ? formatDateTime(attempt.completedAt)
                    : formatDateTime(attempt.startedAt)}
                </div>
              </Link>
            ))}
          </div>

          {attempts.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 p-4 border-t">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                Page {page + 1} of {attempts.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= attempts.totalPages - 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">No attempts yet. Start a quiz to see your progress!</p>
          <Link
            href="/quizzes"
            className="mt-4 inline-block text-primary hover:underline font-medium"
          >
            Browse Quizzes
          </Link>
        </div>
      )}
    </div>
  );
}
