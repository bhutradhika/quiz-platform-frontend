"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_ENDPOINTS } from "@/constants/api";
import { apiClient } from "@/services/api";
import { Quiz, QuizCategory, QuizLevel } from "@/types";
import { BarChart, FileText, PlusCircle, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CATEGORIES = Object.values(QuizCategory);
const LEVELS = Object.values(QuizLevel);

export default function CreateQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<QuizCategory>(QuizCategory.JAVASCRIPT);
  const [level, setLevel] = useState<QuizLevel>(QuizLevel.BEGINNER);
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (title.length < 3) newErrors.title = "Title must be at least 3 characters";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    const response = await apiClient.post<Quiz>(
      API_ENDPOINTS.ADMIN.CREATE_QUIZ,
      {
        title,
        description,
        category,
        level,
        isPublic,
      },
      true,
    );

    if (response.success && response.data && response.data.id) {
      router.push(`/admin/quizzes/${response.data.id}/questions`);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-violet-500 to-purple-600 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Create Quiz</h1>
          <p className="text-purple-100">
            Create a new quiz and add questions to challenge learners
          </p>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
          <PlusCircle className="w-32 h-32" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Quiz Title
            </Label>
            <Input
              id="title"
              placeholder="Enter quiz title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="Enter quiz description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex min-h-25 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Category
              </Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as QuizCategory)}
                className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level" className="flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                Difficulty Level
              </Label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value as QuizLevel)}
                className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <Label htmlFor="isPublic" className="cursor-pointer">
              Make this quiz public
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Creating..." : "Create Quiz"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
