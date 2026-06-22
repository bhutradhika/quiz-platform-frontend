"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCategory, getCategoryColor, getLevelColor } from "@/lib/format";
import { attemptService } from "@/services/attempt";
import { quizService } from "@/services/quiz";
import { AnswerResponse, Question, Quiz } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface AnswerState {
  selectedChoiceId: string;
  isCorrect: boolean;
  correctChoiceId: string;
  isSubmitted: boolean;
}

export default function QuizAttemptContent({
  category,
  level,
  quizId,
  attemptId,
}: {
  category: string;
  level: string;
  quizId: string;
  attemptId: string;
}) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Map<string, AnswerState>>(new Map());
  const [selectedChoice, setSelectedChoice] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const [quizRes, answersRes] = await Promise.all([
        quizService.getQuizById(quizId, false),
        attemptService.getAttemptAnswers(attemptId),
      ]);
      if (cancelled) return;
      if (quizRes.success && quizRes.data) setQuiz(quizRes.data);
      if (answersRes.success && answersRes.data) {
        const existingAnswers = new Map<string, AnswerState>();
        answersRes.data.forEach((answer: AnswerResponse) => {
          existingAnswers.set(answer.questionId, {
            selectedChoiceId: answer.selectedChoiceId,
            isCorrect: answer.isCorrect,
            correctChoiceId: answer.correctChoiceId,
            isSubmitted: true,
          });
        });
        setAnswers(existingAnswers);
        if (quizRes.data?.questions) {
          const firstUnanswered = quizRes.data.questions.findIndex(
            (q) => !existingAnswers.has(q.id),
          );
          setCurrentQuestionIndex(firstUnanswered >= 0 ? firstUnanswered : 0);
        }
      }
      setIsLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [attemptId, quizId]);

  const currentAnswer = useMemo(() => {
    if (!quiz?.questions) return null;
    const q = quiz.questions[currentQuestionIndex];
    return answers.get(q?.id) || null;
  }, [quiz, currentQuestionIndex, answers]);

  const displayedChoice = currentAnswer?.selectedChoiceId ?? selectedChoice;

  if (!quiz || !quiz.questions || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const questions: Question[] = quiz.questions;
  const totalQuestions = questions.length;
  const answeredCount = answers.size;
  const currentQuestion = questions[currentQuestionIndex];
  const isCurrentSubmitted = currentAnswer?.isSubmitted || false;

  const handleSubmitAnswer = async () => {
    if (!displayedChoice || isCurrentSubmitted) return;
    setIsSubmitting(true);
    const response = await attemptService.submitAnswer(attemptId, {
      questionId: currentQuestion.id,
      choiceId: displayedChoice,
    });
    if (response.success && response.data) {
      const result: AnswerResponse = response.data;
      const newAnswers = new Map(answers);
      newAnswers.set(currentQuestion.id, {
        selectedChoiceId: displayedChoice,
        isCorrect: result.isCorrect,
        correctChoiceId: result.correctChoiceId,
        isSubmitted: true,
      });
      setAnswers(newAnswers);
      setSelectedChoice("");
    }
    setIsSubmitting(false);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setSelectedChoice("");
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setSelectedChoice("");
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = async () => {
    if (answeredCount !== totalQuestions) {
      alert("Please answer all questions before finishing");
      return;
    }
    setIsSubmitting(true);
    const response = await attemptService.completeAttempt(attemptId);
    if (response.success && response.data)
      router.push(`/quizzes/${category}/${level}/${quizId}/result?attemptId=${response.data.id}`);
    setIsSubmitting(false);
  };

  const handleNavigate = (index: number) => {
    setSelectedChoice("");
    setCurrentQuestionIndex(index);
  };

  const getChoiceClassName = (choiceId: string) => {
    if (!isCurrentSubmitted)
      return choiceId === displayedChoice ? "border-purple-500 bg-purple-50" : "border-gray-200";
    if (choiceId === currentAnswer?.correctChoiceId) return "border-green-500 bg-green-50";
    if (choiceId === currentAnswer?.selectedChoiceId && !currentAnswer.isCorrect)
      return "border-red-500 bg-red-50";
    return "border-gray-200";
  };

  const progress = (answeredCount / totalQuestions) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className={getCategoryColor(quiz.category)}>
              {formatCategory(quiz.category)}
            </Badge>
            <Badge className={getLevelColor(quiz.level || "BEGINNER")}>
              {formatCategory(quiz.level || "BEGINNER")}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
        </div>
        <Link href={`/quizzes/${category}/${level}`}>
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-linear-to-r from-purple-500 to-violet-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{currentQuestion.text}</h2>
              <RadioGroup
                value={displayedChoice}
                onValueChange={setSelectedChoice}
                disabled={isCurrentSubmitted}
                className="space-y-3"
              >
                {currentQuestion.choices.map((choice) => (
                  <div
                    key={choice.id}
                    onClick={() => !isCurrentSubmitted && setSelectedChoice(choice.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all min-h-13 cursor-pointer ${getChoiceClassName(choice.id)}`}
                  >
                    <RadioGroupItem value={choice.id} id={choice.id} />
                    <Label htmlFor={choice.id} className="flex-1 cursor-pointer text-gray-700">
                      {choice.text}
                    </Label>
                    <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                      {isCurrentSubmitted && choice.id === currentAnswer?.correctChoiceId && (
                        <span className="text-green-600 text-lg font-bold">✔</span>
                      )}
                      {isCurrentSubmitted &&
                        choice.id === currentAnswer?.selectedChoiceId &&
                        !currentAnswer.isCorrect && (
                          <span className="text-red-500 text-lg font-bold">✗</span>
                        )}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="flex gap-2">
                {!isCurrentSubmitted ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!displayedChoice || isSubmitting}
                    className="min-w-32"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Answer"}
                  </Button>
                ) : currentQuestionIndex === totalQuestions - 1 ? (
                  <Button
                    onClick={handleFinish}
                    disabled={answeredCount !== totalQuestions || isSubmitting}
                    className="min-w-32"
                  >
                    {isSubmitting ? "Finishing..." : "Finish Quiz"}
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="gap-2">
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-2 flex-wrap">
        {questions.map((q, index) => {
          const answer = answers.get(q.id);
          const isAnswered = answer?.isSubmitted || false;
          const isCurrent = index === currentQuestionIndex;
          return (
            <button
              key={q.id}
              onClick={() => handleNavigate(index)}
              className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${isCurrent ? "bg-purple-600 text-white" : isAnswered && answer?.isCorrect ? "bg-green-100 text-green-700 border border-green-300" : isAnswered && !answer?.isCorrect ? "bg-red-100 text-red-700 border border-red-300" : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300"}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
