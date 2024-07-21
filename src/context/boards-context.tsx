"use client";

import { createContext, useContext, useOptimistic, useState } from "react";
import { handleOptimisticUpdate } from "~/optimisticHandlers";
import type { BoardType, SetOptimisticType } from "~/types";
import type { ReactNode } from "react";

interface BoardsContextType {
  optimisticBoards: BoardType[];
  setOptimisticBoards: SetOptimisticType;
  loading: {
    deleteBoard: boolean;
    createBoard: boolean;
    makeBoardCurrent: boolean;
  };
  setLoading: React.Dispatch<
    React.SetStateAction<{
      deleteBoard: boolean;
      createBoard: boolean;
      makeBoardCurrent: boolean;
    }>
  >;
  getCurrentBoard: () => BoardType | undefined;
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
  const [loading, setLoading] = useState({
    deleteBoard: false,
    createBoard: false,
    makeBoardCurrent: false,
  });

  const getCurrentBoard = () => {
    return optimisticBoards.find((board) => board.current === true);
  };

  return (
    <BoardsContext.Provider
      value={{
        optimisticBoards,
        setOptimisticBoards,
        loading,
        setLoading,
        getCurrentBoard,
      }}
    >
      {children}
    </BoardsContext.Provider>
  );
};
