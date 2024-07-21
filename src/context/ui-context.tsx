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
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("Boards context not found.");
  }
  return context;
};

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showEditTaskMenu, setShowEditTaskMenu] = useState(true);

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
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
