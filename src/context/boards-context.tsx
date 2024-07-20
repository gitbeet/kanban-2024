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
  currentBoardId: string;
  setCurrentBoardId: React.Dispatch<React.SetStateAction<string>>;
  getCurrentBoard: () => BoardType | undefined;
  loading: {
    deleteBoard: boolean;
  };
  setLoading: React.Dispatch<
    React.SetStateAction<{
      deleteBoard: boolean;
    }>
  >;
}

interface BoardsProviderProps {
  children: ReactNode;
  boards: BoardType[];
}

const BoardsContext = createContext<BoardsContextType | undefined>(undefined);

export const useBoards = () => {
  const context = useContext(BoardsContext);
  if (!context) {
    throw new Error("Boards context   not found.");
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
  const [loading, setLoading] = useState({ deleteBoard: false });
  const [currentBoardId, setCurrentBoardId] = useState<string>(
    optimisticBoards?.[0]?.id ?? "",
  );

  const getCurrentBoard = () => {
    const currentBoard = optimisticBoards.find(
      (board) => board.id === currentBoardId,
    );

    return currentBoard;
  };

  return (
    <BoardsContext.Provider
      value={{
        optimisticBoards,
        setOptimisticBoards,
        currentBoardId,
        setCurrentBoardId,
        getCurrentBoard,
        loading,
        setLoading,
      }}
    >
      {children}
    </BoardsContext.Provider>
  );
};
