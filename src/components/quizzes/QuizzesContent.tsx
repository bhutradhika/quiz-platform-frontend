"use client";

import { QuizzesPageSkeleton } from "@/components/skeletons";
import { formatCategory } from "@/lib/format";
import { quizService } from "@/services/quiz";
import { CategoryStats } from "@/types";
import { BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const categoryGradients: Record<string, string> = {
  JAVASCRIPT: "from-yellow-400 to-orange-500",
  FRONTEND: "from-purple-400 to-pink-500",
  BACKEND: "from-green-400 to-emerald-500",
  JAVA: "from-orange-400 to-red-500",
  PYTHON: "from-cyan-400 to-blue-500",
  DATABASE: "from-pink-400 to-rose-500",
  DEVOPS: "from-indigo-400 to-purple-500",
  MOBILE: "from-rose-400 to-pink-500",
};

export default function QuizzesContent() {
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const response = await quizService.getCategoryStats();
      if (cancelled) return;
      if (response.success && response.data) setCategoryStats(response.data);
      setIsLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) return <QuizzesPageSkeleton />;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-violet-500 to-purple-600 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Explore Quizzes</h1>
          <p className="text-purple-100 text-lg">
            Choose a category and challenge yourself with knowledge-testing quizzes
          </p>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
          <BookOpen className="w-32 h-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryStats.map((stat) => {
          const totalQuizzes = stat.levels.reduce((sum, level) => sum + level.totalQuizzes, 0);
          return (
            <Link
              key={stat.name}
              href={`/quizzes/${stat.name.toLowerCase()}`}
              className="group bg-white rounded-xl p-6 border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-linear-to-br ${categoryGradients[stat.name] || "from-gray-400 to-gray-500"} flex items-center justify-center`}
                >
                  <span className="text-white text-xl font-bold">
                    {formatCategory(stat.name).charAt(0)}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors text-lg">
                {formatCategory(stat.name)}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {totalQuizzes} {totalQuizzes === 1 ? "quiz" : "quizzes"}
              </p>
              <div className="mt-4 flex flex-wrap gap-1">
                {stat.levels.map((level) => (
                  <span
                    key={level.name}
                    className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                  >
                    {formatCategory(level.name)}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
