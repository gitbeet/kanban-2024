"use client";

import { useContext, createContext, useState } from "react";
import type { ReactNode, SetStateAction, Dispatch } from "react";
import { type ColumnType } from "~/types";

interface UIProviderProps {
  children: ReactNode;
}

interface UIContextType {
  //sidebar
  showSidebar: boolean;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
  sidebarAnimating: boolean;
  setSidebarAnimating: Dispatch<SetStateAction<boolean>>;
  // board menus
  showEditBoardMenu: boolean;
  setShowEditBoardMenu: Dispatch<SetStateAction<boolean>>;
  showEditBoardWindow: boolean;
  setShowEditBoardWindow: Dispatch<SetStateAction<boolean>>;
  // column menus
  columnToDelete: ColumnType | null;
  setColumnToDelete: Dispatch<SetStateAction<ColumnType | null>>;
  showConfirmDeleteColumnWindow: boolean;
  setShowConfirmDeleteColumnWindow: Dispatch<SetStateAction<boolean>>;
  //task menus
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
    throw new Error("UI context not found.");
  }
  return context;
};

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  // sidebar
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarAnimating, setSidebarAnimating] = useState(false);
  // board menus
  const [showEditBoardWindow, setShowEditBoardWindow] = useState(false);
  const [showEditBoardMenu, setShowEditBoardMenu] = useState(false);
  // column menus
  const [columnToDelete, setColumnToDelete] = useState<ColumnType | null>(null);
  const [showConfirmDeleteColumnWindow, setShowConfirmDeleteColumnWindow] =
    useState(false);
  // task menus
  const [showEditTaskMenu, setShowEditTaskMenu] = useState(false);
  const [editedTask, setEditedTask] = useState<{
    columnId: string | null;
    taskId: string | null;
  }>({ columnId: null, taskId: null });

  return (
    <UIContext.Provider
      value={{
        // sidebar
        showSidebar,
        setShowSidebar,
        sidebarAnimating,
        setSidebarAnimating,
        // board menus
        showEditBoardWindow,
        setShowEditBoardWindow,
        showEditBoardMenu,
        setShowEditBoardMenu,
        // column menus
        columnToDelete,
        setColumnToDelete,
        showConfirmDeleteColumnWindow,
        setShowConfirmDeleteColumnWindow,
        // task menus
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
