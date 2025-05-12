"use server";

import { db } from "~/server/db";

export const getBackgrounds = async () => {
  try {
    const backgrounds = await db.query.backgrounds.findMany();
    return { backgrounds };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error while getting backgrounds";
    return { error: errorMessage };
  }
};
