import { Header } from "@/components/Header";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50/50 via-white to-pink-50/30">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
