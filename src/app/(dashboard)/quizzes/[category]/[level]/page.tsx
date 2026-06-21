"use client";

import { LevelPageSkeleton } from "@/components/skeletons";
import { useAuth } from "@/context/AuthContext";
import { formatCategory } from "@/lib/format";
import { attemptService } from "@/services/attempt";
import { quizService } from "@/services/quiz";
import { PagedResponse, Quiz } from "@/types";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LevelPage() {
  const params = useParams();
  const category = params.category as string;
  const level = params.level as string;
  const { isAuthenticated } = useAuth();
  const [quizzes, setQuizzes] = useState<PagedResponse<Quiz> | null>(null);
  const [completedQuizIds, setCompletedQuizIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const response = await quizService.getQuizzes(
        page,
        12,
        category.toUpperCase(),
        level.toUpperCase(),
      );
      if (cancelled) return;
      if (response.success && response.data) {
        setQuizzes(response.data);
      }
      setIsLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [category, level, page]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    async function load() {
      const response = await attemptService.getCompletedQuizIds();
      if (cancelled) return;
      if (response.success && response.data) {
        setCompletedQuizIds(new Set(response.data));
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (isLoading) {
    return <LevelPageSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">{formatCategory(category)}</h1>
          <span className="px-3 py-1 rounded-lg bg-white/20 text-sm font-medium">
            {formatCategory(level)}
          </span>
        </div>
        {quizzes && (
          <p className="text-purple-100 text-lg">
            {quizzes.totalResults} {quizzes.totalResults === 1 ? "quiz" : "quizzes"} available
          </p>
        )}
      </div>

      {quizzes && quizzes.content.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.content.map((quiz) => {
              const isCompleted = completedQuizIds.has(quiz.id);
              if (isCompleted) {
                return (
                  <div
                    key={quiz.id}
                    className="bg-white rounded-xl p-6 border border-gray-100 opacity-60 cursor-not-allowed"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-500 text-lg line-clamp-1">
                        {quiz.title}
                      </h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                      {quiz.description || "No description available"}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {quiz.questionCount ?? 0}{" "}
                        {quiz.questionCount === 1 ? "question" : "questions"}
                      </span>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={quiz.id}
                  href={`/quizzes/${category}/${level}/${quiz.id}`}
                  className="block group bg-white rounded-xl p-6 border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all"
                >
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors text-lg line-clamp-1">
                      {quiz.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {quiz.description || "No description available"}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {quiz.questionCount ?? 0}{" "}
                      {quiz.questionCount === 1 ? "question" : "questions"}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>

          {quizzes.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                Page {page + 1} of {quizzes.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= quizzes.totalPages - 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-600">No quizzes found for this category and level</p>
          <Link
            href={`/quizzes/${category}`}
            className="mt-4 inline-block text-primary hover:underline"
          >
            Choose Different Level
          </Link>
        </div>
      )}
    </div>
  );
}
