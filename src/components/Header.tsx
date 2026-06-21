"use client";

import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated) return null;

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/quizzes", label: "Quizzes" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/my-attempts", label: "My Attempts" },
  ];

  if (user?.role === UserRole.ADMIN) {
    navItems.push({ href: "/admin", label: "Admin" });
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:inline">QuizMaster</span>
          </Link>
          <nav className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  pathname === item.href
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <div className="hidden xl:block text-sm whitespace-nowrap">
              <span className="text-gray-500">Welcome,</span>{" "}
              <span className="font-medium text-gray-700">{user?.username || user?.email}</span>
            </div>
            <button
              onClick={logout}
              className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
