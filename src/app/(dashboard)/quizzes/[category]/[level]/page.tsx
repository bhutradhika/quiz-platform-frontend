import LevelContent from "@/components/quizzes/LevelContent";

export default async function LevelPage({
  params,
}: {
  params: Promise<{ category: string; level: string }>;
}) {
  const { category, level } = await params;
  return <LevelContent category={category} level={level} />;
}
