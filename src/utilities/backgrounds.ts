import type { ColorBackground, ImageBackground } from "~/types/background";
export const imageBackgrounds: ImageBackground[] = [
  {
    id: "1",
    type: "image",
    slug: "mountain",
    title: "Mountain",
    value:
      "https://b0ys30u6uc.ufs.sh/f/yL7xBWHcasSVLyIDsgmPyj72oOUbcKIBqYCS5Mwe1udLWisV",
    alt: "Beautiful mountains",
  },
  {
    id: "2",
    type: "image",
    slug: "flowers",
    title: "Flowers",
    value:
      "https://b0ys30u6uc.ufs.sh/f/yL7xBWHcasSVVDSTS4MolNvVB3wzdq4TjHPK69DOU5YiIExA",
    alt: "Beautiful flowers",
  },
];

export const colorBackgrounds: ColorBackground[] = [
  {
    id: "3",
    type: "color",
    slug: "default",
    title: "Default",
    value: "bg-option__default",
    alt: "Default color",
  },
  {
    id: "4",
    type: "color",
    slug: "taskly",
    title: "Taskly",
    value: "bg-option__taskly",
    alt: "Taskly color gradient",
  },
  {
    id: "5",
    type: "color",
    slug: "sunset",
    title: "Sunset",
    value: "bg-option__sunset",
    alt: "Sunset color gradient",
  },
  {
    id: "6",
    type: "color",
    slug: "aurora",
    title: "Aurora",
    value: "bg-option__aurora",
    alt: "Aurora color gradient",
  },
  {
    id: "7",
    type: "color",
    slug: "space",
    title: "Space",
    value: "bg-option__space",
    alt: "Space color gradient",
  },
];

export const backgrounds = [...imageBackgrounds, ...colorBackgrounds];
