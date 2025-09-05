"use client";

import { useEffect } from "react";
interface BoardIdPageProps {
  params: { boardId: string };
}

const BoardIdPage = ({ params }: BoardIdPageProps) => {
  useEffect(() => {
    document.title = `Board - Miro Clone`;
  }, []);

  return (
    <Room >
      <Canvas />
    </Room>
  );
};

export default BoardIdPage;
