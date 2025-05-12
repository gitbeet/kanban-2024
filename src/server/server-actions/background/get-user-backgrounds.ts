"use server";

import { auth } from "@clerk/nextjs/server";
import { unstable_cache as cache } from "next/cache";
import { db } from "~/server/db";

export const getUserBackgrounds = async () => {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const getBackgrounds = cache(
      async () => {
        const result = await db.query.userBackgrounds.findMany({
          where: (model, { eq }) => eq(model.userId, userId),
        });
        return result;
      },
      [`user-backgrounds-${userId}`],
      { tags: [`backgrounds-${userId}`] },
    );

    const backgrounds = await getBackgrounds();
    return { backgrounds };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error while getting user backgrounds";
    return { error: errorMessage };
  }
};
