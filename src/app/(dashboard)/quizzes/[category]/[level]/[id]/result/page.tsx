import QuizResultContent from "@/components/quizzes/QuizResultContent";

export default async function QuizResultPage({ params, searchParams }: { params: Promise<{ category: string; level: string; id: string }>; searchParams: Promise<{ attemptId?: string }> }) {
  const { category, level } = await params;
  const { attemptId } = await searchParams;
  if (!attemptId) return <div className="text-center py-12"><p className="text-gray-600">Invalid result</p></div>;
  return <QuizResultContent category={category} level={level} attemptId={attemptId} />;
}
