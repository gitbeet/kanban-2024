"use client";

import { useContext, createContext, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

interface UIProviderProps {
  children: ReactNode;
}

interface BackgroundContextType {
  background: string;
  setBackground: Dispatch<SetStateAction<string>>;
  imageOpacity: number;
  setImageOpacity: Dispatch<SetStateAction<number>>;
}

const BackgoundContext = createContext<BackgroundContextType | undefined>(
  undefined,
);

export const useBackground = () => {
  const context = useContext(BackgoundContext);
  if (!context) {
    throw new Error("Background context not found.");
  }
  return context;
};

export const BackgroundProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [background, setBackground] = useState("taskly");
  const [imageOpacity, setImageOpacity] = useState(100);

  return (
    <BackgoundContext.Provider
      value={{ background, setBackground, imageOpacity, setImageOpacity }}
    >
      {children}
    </BackgoundContext.Provider>
  );
};
