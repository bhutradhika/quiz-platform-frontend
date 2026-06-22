"use client";

import { formatCategory } from "@/lib/format";
import { quizService } from "@/services/quiz";
import { CategoryStats, LevelStats } from "@/types";
import { Award, ChevronRight, Flame, Target, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const levelIcons: Record<string, typeof Target> = {
  BEGINNER: Target,
  INTERMEDIATE: Zap,
  ADVANCED: Award,
  EXPERT: Flame,
};
const levelColors: Record<string, string> = {
  BEGINNER: "from-green-400 to-emerald-500",
  INTERMEDIATE: "from-blue-400 to-cyan-500",
  ADVANCED: "from-purple-400 to-violet-500",
  EXPERT: "from-red-400 to-orange-500",
};

export default function CategoryContent({ category }: { category: string }) {
  const [categoryStats, setCategoryStats] = useState<CategoryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const response = await quizService.getCategoryStats();
      if (cancelled) return;
      if (response.success && response.data) {
        const stat = response.data.find((s) => s.name?.toUpperCase() === category?.toUpperCase());
        setCategoryStats(stat || null);
      }
      setIsLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [category]);

  if (!categoryStats && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Category not found</p>
        <Link href="/quizzes" className="mt-4 inline-block text-primary hover:underline">
          Browse Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">{formatCategory(category)}</h1>
        <p className="text-purple-100 text-lg">Select a difficulty level to begin your challenge</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gray-200" />
                <div className="w-5 h-5 rounded bg-gray-200" />
              </div>
              <div className="h-5 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryStats?.levels.map((level: LevelStats) => {
            const Icon = levelIcons[level.name] || Target;
            return (
              <Link
                key={level.name}
                href={`/quizzes/${category}/${level.name.toLowerCase()}`}
                className="group bg-white rounded-xl p-6 border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-linear-to-br ${levelColors[level.name]} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors text-lg">
                  {formatCategory(level.name)}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {level.totalQuizzes} {level.totalQuizzes === 1 ? "quiz" : "quizzes"}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
