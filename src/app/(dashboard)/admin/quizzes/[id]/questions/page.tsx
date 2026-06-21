import ManageQuestionsContent from "@/components/admin/ManageQuestionsContent";

export default async function ManageQuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ManageQuestionsContent quizId={id} />;
}
