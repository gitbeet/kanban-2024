"use client";

import { useContext, createContext, useState, useEffect } from "react";
import type { ReactNode, SetStateAction, Dispatch } from "react";
import { disableScrolling, enableScrolling } from "~/utilities/scroll";
import { type ColumnType } from "~/types";

interface UIProviderProps {
  children: ReactNode;
}

interface UIContextType {
  //mobile menu
  showMobileMenu: boolean;
  setShowMobileMenu: Dispatch<SetStateAction<boolean>>;
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
  showConfirmDeleteBoardWindow: boolean;
  setShowConfirmDeleteBoardWindow: Dispatch<SetStateAction<boolean>>;
  // column menus
  columnToDelete: ColumnType | null;
  setColumnToDelete: Dispatch<SetStateAction<ColumnType | null>>;
  showConfirmDeleteColumnWindow: boolean;
  setShowConfirmDeleteColumnWindow: Dispatch<SetStateAction<boolean>>;
  //task menus
  showEditTaskWindow: boolean;
  setShowEditTaskWindow: Dispatch<SetStateAction<boolean>>;
  showEditTaskMenu: boolean;
  setShowEditTaskMenu: Dispatch<SetStateAction<boolean>>;
  showEditTaskSmallMenu: boolean;
  setShowEditTaskSmallMenu: Dispatch<SetStateAction<boolean>>;
  showConfirmDeleteTaskWindow: boolean;
  setShowConfirmDeleteTaskWindow: Dispatch<SetStateAction<boolean>>;
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
  // mobile menu
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  // sidebar
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarAnimating, setSidebarAnimating] = useState(false);
  // board menus
  const [showEditBoardWindow, setShowEditBoardWindow] = useState(false);
  const [showEditBoardMenu, setShowEditBoardMenu] = useState(false);
  const [showConfirmDeleteBoardWindow, setShowConfirmDeleteBoardWindow] =
    useState(false);
  // column menus
  const [columnToDelete, setColumnToDelete] = useState<ColumnType | null>(null);
  const [showConfirmDeleteColumnWindow, setShowConfirmDeleteColumnWindow] =
    useState(false);
  // task menus
  const [showEditTaskWindow, setShowEditTaskWindow] = useState(false);
  const [showEditTaskMenu, setShowEditTaskMenu] = useState(false);
  const [showEditTaskSmallMenu, setShowEditTaskSmallMenu] = useState(false);
  const [showConfirmDeleteTaskWindow, setShowConfirmDeleteTaskWindow] =
    useState(false);
  const [editedTask, setEditedTask] = useState<{
    columnId: string | null;
    taskId: string | null;
  }>({ columnId: null, taskId: null });

  useEffect(() => {
    if (showMobileMenu) {
      disableScrolling();
      return;
    } else {
      enableScrolling();
      return;
    }
  }, [showMobileMenu]);

  return (
    <UIContext.Provider
      value={{
        // mobile menu
        showMobileMenu,
        setShowMobileMenu,
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
        showConfirmDeleteBoardWindow,
        setShowConfirmDeleteBoardWindow,
        // column menus
        columnToDelete,
        setColumnToDelete,
        showConfirmDeleteColumnWindow,
        setShowConfirmDeleteColumnWindow,
        // task menus
        showEditTaskWindow,
        setShowEditTaskWindow,
        showEditTaskMenu,
        setShowEditTaskMenu,
        showEditTaskSmallMenu,
        setShowEditTaskSmallMenu,
        showConfirmDeleteTaskWindow,
        setShowConfirmDeleteTaskWindow,
        editedTask,
        setEditedTask,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
