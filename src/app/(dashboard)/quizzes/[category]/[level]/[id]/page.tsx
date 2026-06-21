"use client";

import { QuizDetailSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { attemptService } from "@/services/attempt";
import { quizService } from "@/services/quiz";
import { Quiz } from "@/types";
import { BookOpen, CheckCircle, HelpCircle, Play } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const category = params.category as string;
  const level = params.level as string;
  const quizId = params.id as string;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const response = await quizService.getQuizById(quizId, false);
      if (cancelled) return;
      if (response.success && response.data) {
        setQuiz(response.data);
      }
      setIsLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [quizId]);

  useEffect(() => {
    if (!isAuthenticated || !quizId) return;

    let cancelled = false;

    async function check() {
      const response = await attemptService.getCompletedQuizIds();
      if (cancelled) return;
      if (response.success && response.data) {
        setIsCompleted(response.data.includes(quizId));
      }
    }

    check();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, quizId]);

  const handleStartQuiz = useCallback(async () => {
    setIsStarting(true);
    const response = await attemptService.startAttempt(quizId);
    if (response.success && response.data) {
      router.push(`/quizzes/${category}/${level}/${quizId}/attempt?attemptId=${response.data.id}`);
    } else if (response.message?.includes("already completed")) {
      setIsCompleted(true);
    } else if (response.message?.includes("incomplete attempt")) {
      const incompleteResponse = await attemptService.getIncompleteAttempt(quizId);
      if (incompleteResponse.success && incompleteResponse.data) {
        router.push(
          `/quizzes/${category}/${level}/${quizId}/attempt?attemptId=${incompleteResponse.data.id}`,
        );
      }
    }
    setIsStarting(false);
  }, [quizId, category, level, router]);

  if (isLoading) {
    return <QuizDetailSkeleton />;
  }

  if (!quiz) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
        <p className="text-gray-600">Quiz not found</p>
        <Button className="mt-4" onClick={() => router.push("/quizzes")}>
          Browse Quizzes
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-purple-100">
          {quiz.description || "Test your knowledge with this quiz"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <HelpCircle className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {quiz.questionCount ?? quiz.questions?.length ?? 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Questions</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">MCQ</p>
            <p className="text-sm text-gray-500 mt-1">Type</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {quiz.totalPoints ?? quiz.questionCount ?? 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Points</p>
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={handleStartQuiz}
        disabled={isStarting || isCompleted}
        className={`w-full h-14 text-lg font-semibold ${isCompleted ? "bg-gray-400 cursor-not-allowed" : ""}`}
        size="lg"
      >
        {isStarting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
            Starting...
          </>
        ) : isCompleted ? (
          <>
            <CheckCircle className="w-5 h-5 mr-2" />
            Already Completed
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2" />
            Start Quiz
          </>
        )}
      </Button>
    </div>
  );
}
