"use server";

import { auth } from "@clerk/nextjs/server";
import { unstable_cache as cache } from "next/cache";
import { db } from "~/server/db";

export const getBoards = async () => {
  try {
    const user = auth();
    if (!user.userId) throw new Error("Unauthorized");

    const getCachedBoards = cache(
      async () => {
        const result = await db.query.boards.findMany({
          where: (model, { eq }) => eq(model.userId, user.userId),
          with: {
            columns: {
              with: {
                tasks: {
                  with: {
                    subtasks: true,
                  },
                },
              },
            },
          },
        });
        return result;
      },
      ["boards", user.userId],
      { tags: [`boards-${user.userId}`] },
    );
    const boards = await getCachedBoards();
    return { boards };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while getting boards";
    return {
      error: errorMessage,
    };
  }
};
