"use client";

import { DashboardSkeleton } from "@/components/skeletons";
import { useAuth } from "@/context/AuthContext";
import { formatCategory } from "@/lib/format";
import { attemptService } from "@/services/attempt";
import { quizService } from "@/services/quiz";
import { CategoryStats, DashboardStats } from "@/types";
import { BookOpen, Target, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    async function load() {
      const [statsRes, categoriesRes] = await Promise.all([
        attemptService.getDashboardStats(),
        quizService.getCategoryStats(),
      ]);
      if (cancelled) return;
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data);
      }
      setStatsLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (statsLoading) {
    return <DashboardSkeleton />;
  }

  const displayStats = stats || { totalQuizzes: 0, completedQuizzes: 0, averageScore: 0 };
  const totalAvailable = categories.reduce(
    (sum, c) => sum + c.levels.reduce((s, l) => s + l.totalQuizzes, 0),
    0,
  );

  const statCards = [
    {
      label: "Total Quizzes",
      value: displayStats.totalQuizzes,
      icon: BookOpen,
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-violet-50",
    },
    {
      label: "Completed",
      value: displayStats.completedQuizzes,
      icon: Target,
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Average Score",
      value: `${displayStats.averageScore.toFixed(0)}%`,
      icon: Trophy,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
    },
    {
      label: "Available Quizzes",
      value: totalAvailable,
      icon: Zap,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl gradient-bg p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.username || "Learner"}!</h1>
          <p className="text-purple-100 text-lg">
            Ready to challenge yourself today? Pick a quiz and test your knowledge.
          </p>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
          <Trophy className="w-32 h-32" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className={`${stat.bgColor} rounded-xl p-6 border border-white/50`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-linear-to-br ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Browse by Category</h2>
          <Link href="/quizzes" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
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
      </div>
    </div>
  );
}
