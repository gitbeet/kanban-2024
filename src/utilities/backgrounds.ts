import bg from "../../public/test-bg-4.jpg";
import bgTwo from "../../public/test-bg-2.jpg";
import bgTest from "../../public/test-bg-3.jpg";
import type { ColorBackground, ImageBackground } from "~/types/background";
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
  // {
  //   type: "image",
  //   slug: "test",
  //   title: "Test",
  //   value: bgTest,
  //   alt: "Test background",
  // },
];

export const colorBackgrounds: ColorBackground[] = [
  {
    type: "color",
    slug: "default",
    title: "Default",
    value: "bg-option__default",
    alt: "Default color",
  },
  {
    type: "color",
    slug: "taskly",
    title: "Taskly",
    value: "bg-option__taskly",
    alt: "Taskly color gradient",
  },
  {
    type: "color",
    slug: "sunset",
    title: "Sunset",
    value: "bg-option__sunset",
    alt: "Sunset color gradient",
  },
  {
    type: "color",
    slug: "aurora",
    title: "Aurora",
    value: "bg-option__aurora",
    alt: "Aurora color gradient",
  },
  {
    type: "color",
    slug: "space",
    title: "Space",
    value: "bg-option__space",
    alt: "Space color gradient",
  },
];

export const backgrounds = [...imageBackgrounds, ...colorBackgrounds];
