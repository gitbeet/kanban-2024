"use client";

import React, {
  type ReactNode,
  createContext,
  useContext,
  useOptimistic,
  useState,
} from "react";
import { handleOptimisticUpdate } from "~/optimisticHandlers";
import type { BoardType, SetOptimisticType } from "~/types";

interface BoardsContextType {
  optimisticBoards: BoardType[];
  setOptimisticBoards: SetOptimisticType;
  currentBoardId: string | null;
  setCurrentBoardId: React.Dispatch<React.SetStateAction<string | null>>;
}

interface BoardsProviderProps {
  children: ReactNode;
  boards: BoardType[];
}

const BoardsContext = createContext<BoardsContextType | undefined>(undefined);

export const useBoards = () => {
  const context = useContext(BoardsContext);
  if (!context) {
    throw new Error("Boards context not found.");
  }
  return context;
};

export const BoardsProvider: React.FC<BoardsProviderProps> = ({
  children,
  boards,
}) => {
  const [optimisticBoards, setOptimisticBoards] = useOptimistic(
    boards,
    handleOptimisticUpdate,
  );

  const [currentBoardId, setCurrentBoardId] = useState<string | null>(
    optimisticBoards?.[0]?.id ?? null,
  );

  return (
    <BoardsContext.Provider
      value={{
        optimisticBoards,
        setOptimisticBoards,
        currentBoardId,
        setCurrentBoardId,
      }}
    >
      {children}
    </BoardsContext.Provider>
  );
};
