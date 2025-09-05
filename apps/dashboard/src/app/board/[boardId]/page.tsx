import BoardCanvas from "@/core/components/dashboard/board/canvas";

export default async function BoardPage({ params }: { params: { boardId: string } }) {
  return (
    <div className="min-h-screen">
      <BoardCanvas boardId={params.boardId} />
    </div>
  );
}
