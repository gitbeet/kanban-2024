"use server";

import { auth } from "@clerk/nextjs/server";
import { unstable_cache as cache } from "next/cache";
import { db } from "~/server/db";

export const getUserData = async (userId?: string) => {
  try {
    let actualUserId = userId;
    if (!actualUserId) {
      const { userId } = auth();
      if (userId) actualUserId = userId;
    }
    if (!actualUserId) throw new Error("Unauthorized");
    const getData = cache(
      async () => {
        const result = await db.query.userDatas.findFirst({
          where: (model, { eq }) => eq(model.userId, actualUserId),
        });
        return result;
      },
      ["user-data", actualUserId],
      { tags: [`user-data-${actualUserId}`] },
    );
    const data = await getData();
    return { data };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while getting user data";
    return { error: errorMessage };
  }
};
