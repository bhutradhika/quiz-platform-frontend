"use client";

import { formatCategory } from "@/lib/format";
import { attemptService } from "@/services/attempt";
import { quizService } from "@/services/quiz";
import { CategoryStats, DashboardStats } from "@/types";
import { BookOpen, Target, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const statCards = [
  {
    label: "Total Quizzes",
    icon: BookOpen,
    bgColor: "bg-violet-50",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    label: "Completed",
    icon: Target,
    bgColor: "bg-emerald-50",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    label: "Average Score",
    icon: Trophy,
    bgColor: "bg-amber-50",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    label: "Available Quizzes",
    icon: Zap,
    bgColor: "bg-pink-50",
    gradient: "from-pink-500 to-rose-500",
  },
];

export default function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [statsRes, categoriesRes] = await Promise.all([
        attemptService.getDashboardStats(),
        quizService.getCategoryStats(),
      ]);
      if (cancelled) return;
      if (statsRes.success && statsRes.data) setStats(statsRes.data);
      if (categoriesRes.success && categoriesRes.data) setCategories(categoriesRes.data);
      setIsLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const displayStats = stats || { totalQuizzes: 0, completedQuizzes: 0, averageScore: 0 };
  const totalAvailable = categories.reduce(
    (sum, c) => sum + c.levels.reduce((s, l) => s + l.totalQuizzes, 0),
    0,
  );

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl gradient-bg p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-purple-100 text-lg">
            Ready to challenge yourself today? Pick a quiz and test your knowledge.
          </p>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
          <Trophy className="w-32 h-32" />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-200" />
              </div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <div
              key={stat.label}
              className={`${stat.bgColor} rounded-xl p-6 border border-white/50`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-linear-to-br ${stat.gradient}`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {i === 2
                  ? `${displayStats.averageScore.toFixed(0)}%`
                  : i === 3
                    ? totalAvailable
                    : i === 1
                      ? displayStats.completedQuizzes
                      : displayStats.totalQuizzes}
              </p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Browse by Category</h2>
          <Link href="/quizzes" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-gray-200 rounded w-20" />
                  <div className="h-5 bg-gray-200 rounded w-8" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-16 mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((category) => {
              const totalQuizzes = category.levels.reduce((sum, l) => sum + l.totalQuizzes, 0);
              return (
                <Link
                  key={category.name}
                  href={`/quizzes/${category.name.toLowerCase()}`}
                  className="group bg-white rounded-xl p-5 border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {formatCategory(category.name)}
                    </h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-lg bg-purple-100 text-purple-700">
                      {totalQuizzes}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{category.levels.length} levels</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
