import { type StaticImageData } from "next/image";
import { type backgrounds } from "~/server/db/schema";

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

export type UserBackgroundType = typeof backgrounds.$inferSelect;

export type ColorBackgroundData = Pick<ColorBackground, "type" | "value">;
export type ImageBackgroundData = Pick<ImageBackground, "type" | "value">;
export type UserBackgroundData = { type: "user" } & Pick<
  UserBackgroundType,
  "fileUrl"
>;

export type BackgroundData =
  | ColorBackgroundData
  | ImageBackgroundData
  | UserBackgroundData;
