"use client";

import { useContext, createContext, useState } from "react";
import type { ReactNode, SetStateAction, Dispatch } from "react";

interface UIProviderProps {
  children: ReactNode;
}

interface UIContextType {
  showSidebar: boolean;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
  showEditTaskMenu: boolean;
  setShowEditTaskMenu: Dispatch<SetStateAction<boolean>>;
  editedTask: {
    columnId: string | null;
    taskId: string | null;
  };
  setEditedTask: Dispatch<
    SetStateAction<{
      columnId: string | null;
      taskId: string | null;
    }>
  >;
  showEditBoardMenu: boolean;
  setShowEditBoardMenu: Dispatch<SetStateAction<boolean>>;
  columnToDeleteId: string;
  setColumnToDeleteId: Dispatch<SetStateAction<string>>;
  showConfirmDeleteColumnWindow: boolean;
  setShowConfirmDeleteColumnWindow: Dispatch<SetStateAction<boolean>>;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("UI context not found.");
  }
  return context;
};

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showEditTaskMenu, setShowEditTaskMenu] = useState(false);
  const [showEditBoardMenu, setShowEditBoardMenu] = useState(false);

  const [columnToDeleteId, setColumnToDeleteId] = useState("");
  const [showConfirmDeleteColumnWindow, setShowConfirmDeleteColumnWindow] =
    useState(false);

  const [editedTask, setEditedTask] = useState<{
    columnId: string | null;
    taskId: string | null;
  }>({ columnId: null, taskId: null });

  return (
    <UIContext.Provider
      value={{
        showSidebar,
        setShowSidebar,
        showEditTaskMenu,
        setShowEditTaskMenu,
        editedTask,
        setEditedTask,
        showEditBoardMenu,
        setShowEditBoardMenu,
        columnToDeleteId,
        setColumnToDeleteId,
        showConfirmDeleteColumnWindow,
        setShowConfirmDeleteColumnWindow,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
