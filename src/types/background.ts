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
