"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { UTApi } from "uploadthing/server";
import { db } from "~/server/db";
import { userBackgrounds } from "~/server/db/schema";
import type { DeleteUserBackgroundAction } from "~/types/actions";
import { UserBackgroundSchema } from "~/utilities/zod-schemas";

export const deleteUserBackground = async (
  action: DeleteUserBackgroundAction,
) => {
  try {
    const user = auth();
    if (!user.userId) throw new Error("Unauthorized");

    const { payload } = action;
    const { backgroundId, fileKey } = payload;

    const result = UserBackgroundSchema.pick({ id: true }).safeParse({
      id: backgroundId,
    });
    if (!result.success) {
      throw new Error(
        result.error.issues[0]?.message ??
          "Error while deleting a user background",
      );
    }

    const deletedRows = await db
      .delete(userBackgrounds)
      .where(eq(userBackgrounds.id, backgroundId));
    if (!deletedRows) throw new Error("Error while deleting the background");

    const api = new UTApi();
    await api.deleteFiles(fileKey);
    revalidateTag(`backgrounds-${user.userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error while deleting a user background";
    return { error: errorMessage };
  }
};
