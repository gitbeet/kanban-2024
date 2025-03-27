import { type userBackgrounds } from "~/server/db/schema";

export type ColorBackground = {
  id: string;
  type: "color";
  slug: string;
  title: string;
  value: string;
  alt: string;
};
export type ImageBackground = {
  id: string;
  type: "image";
  slug: string;
  title: string;
  value: string;
  alt: string;
};
export type BackgroundType = ColorBackground | ImageBackground;

export type UserBackgroundType = typeof userBackgrounds.$inferSelect;

export type ColorBackgroundData = Pick<
  ColorBackground,
  "type" | "value" | "id"
>;
export type ImageBackgroundData = Pick<
  ImageBackground,
  "type" | "value" | "id"
>;
export type UserBackgroundData = { type: "user" } & Pick<
  UserBackgroundType,
  "fileUrl" | "id"
>;

export type BackgroundData =
  | ColorBackgroundData
  | ImageBackgroundData
  | UserBackgroundData;
