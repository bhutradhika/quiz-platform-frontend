"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { API_ENDPOINTS } from "@/constants/api";
import { formatCategory } from "@/lib/format";
import { cn } from "@/lib/utils";
import { apiClient } from "@/services/api";
import { quizService } from "@/services/quiz";
import { QuestionRequest, QuestionType, Quiz } from "@/types";
import { CheckCircle, FileQuestion, HelpCircle, PlusCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ManageQuestionsPage() {
  const params = useParams();
  const quizId = params.id as string;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [choices, setChoices] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

  async function loadQuiz() {
    setIsLoading(true);
    const response = await quizService.getQuizById(quizId, true);
    if (response.success && response.data) {
      setQuiz(response.data);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setIsLoading(true);
      const response = await quizService.getQuizById(quizId, true);
      if (cancelled) return;
      if (response.success && response.data) {
        setQuiz(response.data);
      }
      setIsLoading(false);
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [quizId]);

  const handleChoiceChange = (index: number, text: string) => {
    const newChoices = [...choices];
    newChoices[index].text = text;
    setChoices(newChoices);
  };

  const handleCorrectChange = (index: number) => {
    const newChoices = choices.map((choice, i) => ({
      ...choice,
      isCorrect: i === index,
    }));
    setChoices(newChoices);
  };

  const handleAddQuestion = async () => {
    if (!questionText.trim()) return;
    if (choices.some((c) => !c.text.trim())) return;
    if (!choices.some((c) => c.isCorrect)) return;

    setIsAdding(true);
    const questionData: QuestionRequest = {
      text: questionText,
      type: QuestionType.MULTIPLE_CHOICE,
      points: quiz?.pointsPerQuestion || 1,
      choices: choices.map((c, i) => ({
        text: c.text,
        isCorrect: c.isCorrect,
        orderIndex: i,
      })),
    };

    const response = await apiClient.post(
      API_ENDPOINTS.ADMIN.ADD_QUESTION(quizId),
      questionData,
      true,
    );

    if (response.success) {
      setQuestionText("");
      setChoices([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]);
      loadQuiz();
    }
    setIsAdding(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
        <p className="text-gray-500">Quiz not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-violet-500 to-purple-600 p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-purple-100">Manage questions for this quiz</p>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
          <FileQuestion className="w-32 h-32" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <PlusCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Add Question</h2>
            <p className="text-sm text-gray-500">Create a new multiple choice question</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question Text</Label>
            <textarea
              id="question"
              placeholder="Enter your question"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="flex min-h-25 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <Label>Points per question</Label>
            <p className="text-sm text-gray-500">
              {quiz?.pointsPerQuestion || 1} point{(quiz?.pointsPerQuestion || 1) > 1 ? "s" : ""}{" "}
              per question (based on {quiz?.level ? formatCategory(quiz.level) : "quiz"} level)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Choices (select the correct answer)</Label>
            <div className="space-y-2">
              {choices.map((choice, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    placeholder={`Choice ${index + 1}`}
                    value={choice.text}
                    onChange={(e) => handleChoiceChange(index, e.target.value)}
                    className={cn("flex-1", choice.isCorrect && "border-green-500 bg-green-50")}
                  />
                  <Button
                    type="button"
                    variant={choice.isCorrect ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCorrectChange(index)}
                    className={choice.isCorrect ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {choice.isCorrect ? <CheckCircle className="w-4 h-4" /> : "Correct"}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleAddQuestion} disabled={isAdding} className="w-full">
            {isAdding ? "Adding..." : "Add Question"}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Current Questions</h2>
            <p className="text-sm text-gray-500">{quiz.questions?.length || 0} questions added</p>
          </div>
        </div>

        {quiz.questions && quiz.questions.length > 0 ? (
          <div className="space-y-3">
            {quiz.questions.map((question, index) => (
              <div key={question.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <p className="font-medium text-gray-900">
                    {index + 1}. {question.text}
                  </p>
                  <Badge variant="secondary">{question.points} pts</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {question.choices?.map((choice) => (
                    <div
                      key={choice.id}
                      className={cn(
                        "p-2 rounded-lg text-sm",
                        choice.isCorrect
                          ? "bg-green-100 text-green-800 font-medium"
                          : "bg-white text-gray-600",
                      )}
                    >
                      {choice.text}
                      {choice.isCorrect && " ✓"}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No questions yet. Add your first question above.
          </div>
        )}
      </div>
    </div>
  );
}
