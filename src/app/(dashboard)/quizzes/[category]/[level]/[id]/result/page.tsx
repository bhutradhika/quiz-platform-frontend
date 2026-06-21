"use client";

import { Button } from "@/components/ui/button";
import { attemptService } from "@/services/attempt";
import { Attempt } from "@/types";
import { Check, Home, RotateCcw, Trophy, X } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuizResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const category = params.category as string;
  const level = params.level as string;
  const attemptId = searchParams.get("attemptId");

  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!attemptId) return;

    const id = attemptId;
    let cancelled = false;

    async function load() {
      const response = await attemptService.getAttemptById(id);
      if (cancelled) return;
      if (response.success && response.data) {
        setAttempt(response.data);
      }
      setIsLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [attemptId]);

  if (isLoading || !attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const percentage =
    attempt.percentage || (attempt.maxScore > 0 ? (attempt.score / attempt.maxScore) * 100 : 0);
  const isPassed = percentage >= 50;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div
        className={`relative overflow-hidden rounded-2xl p-8 text-white text-center ${
          isPassed
            ? "bg-linear-to-br from-green-500 to-emerald-600"
            : "bg-linear-to-br from-red-500 to-rose-600"
        }`}
      >
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isPassed ? "Congratulations!" : "Keep Practicing!"}
          </h1>
          <p className="text-white/80">{attempt.quizTitle}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <div
          className="text-7xl font-bold mb-2"
          style={{ color: isPassed ? "#10b981" : "#ef4444" }}
        >
          {percentage.toFixed(0)}%
        </div>
        <p className="text-gray-500 mb-6">Your Score</p>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-gray-900">{attempt.score.toFixed(0)}</p>
            <p className="text-xs text-gray-500 mt-1">Points Earned</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-gray-900">{attempt.maxScore.toFixed(0)}</p>
            <p className="text-xs text-gray-500 mt-1">Total Points</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-gray-900">
              {isPassed ? (
                <Check className="w-6 h-6 mx-auto text-green-500" />
              ) : (
                <X className="w-6 h-6 mx-auto text-red-500" />
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">{isPassed ? "Passed" : "Failed"}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Link href={`/quizzes/${category}/${level}`}>
          <Button variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Try Another
          </Button>
        </Link>
        <Link href="/quizzes">
          <Button className="gap-2">
            <Home className="w-4 h-4" />
            Browse Quizzes
          </Button>
        </Link>
      </div>
    </div>
  );
}
