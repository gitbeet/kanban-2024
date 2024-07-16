"use client";

import { useContext, createContext, useState } from "react";
import type { ReactNode, SetStateAction, Dispatch } from "react";

interface UIProviderProps {
  children: ReactNode;
}

interface UIContextType {
  showSidebar: boolean;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
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
  return (
    <UIContext.Provider value={{ showSidebar, setShowSidebar }}>
      {children}
    </UIContext.Provider>
  );
};
