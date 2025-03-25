"use client";

import { createContext, useContext, useOptimistic, useState } from "react";
import { handleOptimisticUpdate } from "~/optimisticHandlers";
import type { BoardType, SetOptimisticType } from "~/types";
import type { ReactNode } from "react";
import { Action } from "~/types/actions";

interface BoardsContextType {
  optimisticBoards: BoardType[];
  setOptimisticBoards: SetOptimisticType;
  loading: {
    DELETE_BOARD: boolean;
    createBoard: boolean;
    MAKE_BOARD_CURRENT: boolean;
  };
  setLoading: React.Dispatch<
    React.SetStateAction<{
      DELETE_BOARD: boolean;
      createBoard: boolean;
      MAKE_BOARD_CURRENT: boolean;
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
  const [optimisticBoards, setOptimisticBoards] = useOptimistic<
    BoardType[],
    Action
  >(boards, handleOptimisticUpdate);
  const [loading, setLoading] = useState({
    DELETE_BOARD: false,
    createBoard: false,
    MAKE_BOARD_CURRENT: false,
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
