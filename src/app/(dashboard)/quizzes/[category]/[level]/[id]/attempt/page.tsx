import QuizAttemptContent from "@/components/quizzes/QuizAttemptContent";

export default async function QuizAttemptPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string; level: string; id: string }>;
  searchParams: Promise<{ attemptId?: string }>;
}) {
  const { category, level, id } = await params;
  const { attemptId } = await searchParams;
  if (!attemptId)
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Invalid attempt</p>
      </div>
    );
  return <QuizAttemptContent category={category} level={level} quizId={id} attemptId={attemptId} />;
}
