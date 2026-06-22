"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCategory, formatDateTime } from "@/lib/format";
import { quizService } from "@/services/quiz";
import { LeaderboardEntry } from "@/types";
import { Award, Flame, Medal, Target, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const levels = [
  { value: "BEGINNER", label: "Beginner", icon: Target, color: "text-green-600" },
  { value: "INTERMEDIATE", label: "Intermediate", icon: Zap, color: "text-blue-600" },
  { value: "ADVANCED", label: "Advanced", icon: Award, color: "text-purple-600" },
  { value: "EXPERT", label: "Expert", icon: Flame, color: "text-red-600" },
];

export default function LeaderboardContent() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const response = await quizService.getCategories();
      if (cancelled) return;
      if (response.success && response.data) setCategories(response.data);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const allEntries: LeaderboardEntry[] = [];

      if (selectedCategory && selectedLevel) {
        const quizzesResponse = await quizService.getQuizzes(0, 100, selectedCategory);
        if (cancelled) return;
        if (quizzesResponse.success && quizzesResponse.data) {
          for (const quiz of quizzesResponse.data.content) {
            if (quiz.level === selectedLevel) {
              const leaderboardResponse = await quizService.getLeaderboard(quiz.id, 20);
              if (cancelled) return;
              if (leaderboardResponse.success && leaderboardResponse.data)
                allEntries.push(...leaderboardResponse.data);
            }
          }
        }
      } else if (selectedCategory) {
        const quizzesResponse = await quizService.getQuizzes(0, 100, selectedCategory);
        if (cancelled) return;
        if (quizzesResponse.success && quizzesResponse.data) {
          for (const quiz of quizzesResponse.data.content) {
            const leaderboardResponse = await quizService.getLeaderboard(quiz.id, 10);
            if (cancelled) return;
            if (leaderboardResponse.success && leaderboardResponse.data)
              allEntries.push(...leaderboardResponse.data);
          }
        }
      } else if (selectedLevel) {
        const quizzesResponse = await quizService.getQuizzes(0, 100);
        if (cancelled) return;
        if (quizzesResponse.success && quizzesResponse.data) {
          for (const quiz of quizzesResponse.data.content) {
            if (quiz.level === selectedLevel) {
              const leaderboardResponse = await quizService.getLeaderboard(quiz.id, 20);
              if (cancelled) return;
              if (leaderboardResponse.success && leaderboardResponse.data)
                allEntries.push(...leaderboardResponse.data);
            }
          }
        }
      } else {
        const quizzesResponse = await quizService.getQuizzes(0, 100);
        if (cancelled) return;
        if (quizzesResponse.success && quizzesResponse.data) {
          for (const quiz of quizzesResponse.data.content) {
            const leaderboardResponse = await quizService.getLeaderboard(quiz.id, 10);
            if (cancelled) return;
            if (leaderboardResponse.success && leaderboardResponse.data)
              allEntries.push(...leaderboardResponse.data);
          }
        }
      }

      if (cancelled) return;

      allEntries.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.percentage - a.percentage;
      });
      const ranked = allEntries.slice(0, 50).map((entry, index) => ({ ...entry, rank: index + 1 }));
      setLeaderboard(ranked);
      setIsLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [selectedCategory, selectedLevel]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return (
      <span className="w-5 h-5 flex items-center justify-center text-sm font-medium">{rank}</span>
    );
  };

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-amber-500 to-orange-600 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-amber-100 text-lg">Top performers across all quizzes</p>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
          <Trophy className="w-32 h-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Filter by Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedLevel("")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedLevel === "" ? "bg-purple-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                All Levels
              </button>
              {levels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setSelectedLevel(level.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${selectedLevel === level.value ? "bg-purple-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  <level.icon
                    className={`w-4 h-4 ${selectedLevel === level.value ? "text-white" : level.color}`}
                  />
                  {level.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Filter by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedCategory === "" ? "bg-purple-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat ? "bg-purple-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {formatCategory(cat)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>
            {selectedCategory && selectedLevel
              ? `${formatCategory(selectedCategory)} - ${formatCategory(selectedLevel)} Leaderboard`
              : selectedCategory
                ? `${formatCategory(selectedCategory)} Leaderboard`
                : selectedLevel
                  ? `${formatCategory(selectedLevel)} Leaderboard`
                  : "Global Leaderboard"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <div className="grid grid-cols-6 gap-4 p-3 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-lg">
                <div>Rank</div>
                <div>Player</div>
                <div>Quiz</div>
                <div>Score</div>
                <div>Percentage</div>
                <div>Date</div>
              </div>
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-6 gap-4 p-4 border-b last:border-0 items-center"
                >
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
                  <div className="h-5 bg-gray-200 rounded w-10 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                </div>
              ))}
            </div>
          ) : leaderboard.length > 0 ? (
            <div className="space-y-2">
              <div className="grid grid-cols-6 gap-4 p-3 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-lg">
                <div>Rank</div>
                <div>Player</div>
                <div>Quiz</div>
                <div>Score</div>
                <div>Percentage</div>
                <div>Date</div>
              </div>
              {leaderboard.map((entry) => (
                <div
                  key={`${entry.attemptId}-${entry.rank}`}
                  className="grid grid-cols-6 gap-4 p-4 border-b last:border-0 items-center hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">{getRankIcon(entry.rank)}</div>
                  <div className="font-medium text-gray-900">{entry.username || "Anonymous"}</div>
                  <div className="text-sm text-gray-600 truncate">{entry.quizTitle}</div>
                  <div className="font-semibold">
                    <span className="text-purple-600">{entry.score?.toFixed(0)}</span>
                    <span className="text-gray-400">/{entry.maxScore?.toFixed(0)}</span>
                  </div>
                  <div>
                    <Badge
                      variant={
                        entry.percentage >= 70
                          ? "success"
                          : entry.percentage >= 50
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {entry.percentage?.toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">{formatDateTime(entry.completedAt)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No attempts yet. Be the first to take a quiz!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
