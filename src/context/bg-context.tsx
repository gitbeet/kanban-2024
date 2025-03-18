"use client";

import { useContext, createContext, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import bg from "../../public/test-bg-4.jpg";
import bgTwo from "../../public/test-bg-2.jpg";
import { StaticImageData } from "next/image";

export type ColorBackground = {
  type: "color";
  slug: string;
  title: string;
  value: string;
  alt: string;
};
export type ImageBackground = {
  type: "image";
  slug: string;
  title: string;
  value: StaticImageData;
  alt: string;
};
export type BackgroundType = ColorBackground | ImageBackground;
export const imageBackgrounds: ImageBackground[] = [
  {
    type: "image",
    slug: "mountain",
    title: "Mountain",
    value: bg,
    alt: "Beautiful mountains",
  },
  {
    type: "image",
    slug: "flowers",
    title: "Flowers",
    value: bgTwo,
    alt: "Beautiful flowers",
  },
];

export const colorBackgrounds: ColorBackground[] = [
  {
    type: "color",
    slug: "default",
    title: "Default",
    value: "bg-neutral-250 dark:bg-neutral-750",
    alt: "Default color",
  },
  {
    type: "color",
    slug: "taskly",
    title: "Taskly",
    value: "bg-gradient-to-br from-primary-700 to-primary-600",
    alt: "Taskly color gradient",
  },
  {
    type: "color",
    slug: "sunset",
    title: "Sunset",
    value: "bg-gradient-to-br from-[#ff0f7b] to-[#f89b29]",
    alt: "Sunset color gradient",
  },
  {
    type: "color",
    slug: "aurora",
    title: "Aurora",
    value: "bg-gradient-to-br from-[#84ffc9] via-[#aab2ff] to-[#eca0ff]",
    alt: "Aurora color gradient",
  },
  {
    type: "color",
    slug: "space",
    title: "Space",
    value: "bg-gradient-to-br from-[#0968e5] to-[#091970]",
    alt: "Space color gradient",
  },
];

export const backgrounds = [...imageBackgrounds, ...colorBackgrounds];

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
