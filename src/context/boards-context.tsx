"use client";

import React, {
  type ReactNode,
  createContext,
  useContext,
  useOptimistic,
} from "react";
import { handleOptimisticUpdate } from "~/optimisticHandlers";
import type { BoardType, SetOptimisticType } from "~/types";

interface BoardsContextType {
  optimisticBoards: BoardType[];
  setOptimisticBoards: SetOptimisticType;
}

const BoardsContext = createContext<BoardsContextType | undefined>(undefined);

export const useBoards = () => {
  const context = useContext(BoardsContext);
  if (!context) {
    throw new Error("Boards context not found.");
  }
  return context;
};

interface BoardsProviderProps {
  children: ReactNode;
  boards: BoardType[];
}

export const BoardsProvider: React.FC<BoardsProviderProps> = ({
  children,
  boards,
}) => {
  const [optimisticBoards, setOptimisticBoards] = useOptimistic(
    boards,
    handleOptimisticUpdate,
  );

  return (
    <BoardsContext.Provider value={{ optimisticBoards, setOptimisticBoards }}>
      {children}
    </BoardsContext.Provider>
  );
};
