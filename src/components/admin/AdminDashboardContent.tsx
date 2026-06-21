"use client";

import { AdminSkeleton } from "@/components/skeletons";
import { quizService } from "@/services/quiz";
import { AdminStats } from "@/types";
import { BookOpen, ChevronRight, Grid3X3, Layers, PlusCircle, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const quickActions = [
  {
    title: "Create Quiz",
    description: "Create a new quiz and add questions",
    href: "/admin/quizzes/new",
    icon: PlusCircle,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    title: "View All Quizzes",
    description: "Browse and manage existing quizzes",
    href: "/quizzes",
    icon: BookOpen,
    gradient: "from-blue-500 to-cyan-600",
  },
];

export default function AdminDashboardContent() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const response = await quizService.getAdminStats();
      if (cancelled) return;
      if (response.success && response.data) setStats(response.data);
      setIsLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) return <AdminSkeleton />;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-700 to-slate-900 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-slate-300 text-lg">Manage quizzes and view platform statistics</p>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
          <Settings className="w-32 h-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Quizzes</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalQuizzes ?? "-"}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Questions</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalQuestions ?? "-"}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-linear-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Categories</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalCategories ?? "-"}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Grid3X3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group bg-white rounded-xl p-6 border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all flex items-center gap-4"
            >
              <div
                className={`w-14 h-14 rounded-lg bg-linear-to-br ${action.gradient} flex items-center justify-center shrink-0`}
              >
                <action.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{action.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
