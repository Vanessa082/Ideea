import BoardCanvas from "@/core/components/dashboard/board/canvas";

export default async function BoardPage({ params }: { params: Promise<{ boardId: string }> }) {
  const { boardId } = await params;
  return (
    <div className="min-h-screen">
      <BoardCanvas boardId={boardId} />
    </div>
  );
}
