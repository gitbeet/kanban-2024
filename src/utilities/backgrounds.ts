import bg from "../../public/test-bg-4.jpg";
import bgTwo from "../../public/test-bg-2.jpg";
import { ColorBackground, ImageBackground } from "~/types/background";
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
