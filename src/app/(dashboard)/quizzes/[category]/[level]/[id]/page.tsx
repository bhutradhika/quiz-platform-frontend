import QuizDetailContent from "@/components/quizzes/QuizDetailContent";

export default async function QuizDetailPage({
  params,
}: {
  params: Promise<{ category: string; level: string; id: string }>;
}) {
  const { category, level, id } = await params;
  return <QuizDetailContent category={category} level={level} quizId={id} />;
}
