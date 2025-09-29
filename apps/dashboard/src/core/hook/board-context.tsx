"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface BoardContextType {
  boardTitle: string | null;
  setBoardTitle: (title: string) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [boardTitle, setBoardTitle] = useState<string | null>(null);

  return (
    <BoardContext.Provider value={{ boardTitle, setBoardTitle }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};