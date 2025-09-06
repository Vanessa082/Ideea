import BoardCanvas from "@/core/components/dashboard/board/canvas";
import CollaborativeDomySection from "@/core/components/dashboard/collaborative/CollaborativeDomySection";

export default async function BoardPage({ params }: { params: Promise<{ boardId: string }> }) {
  const { boardId } = await params;
  return (
    <div className="min-h-screen">
      <BoardCanvas boardId={boardId} />
      <CollaborativeDomySection />
    </div>
  );
}
