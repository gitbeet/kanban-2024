"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { db } from "~/server/db";
import { userBackgrounds } from "~/server/db/schema";
import type { UploadUserBackgroundAction } from "~/types/actions";
import { UserBackgroundSchema } from "~/utilities/zod-schemas";

export const uploadUserBackground = async (
  action: UploadUserBackgroundAction,
) => {
  try {
    const user = auth();
    if (!user.userId) throw new Error("Unauthorized");

    const { payload } = action;
    const { background } = payload;

    const result = UserBackgroundSchema.safeParse(background);
    if (!result.success) {
      throw new Error(
        result.error.issues[0]?.message ??
          "Error while uploading a user background",
      );
    }

    if (background.userId !== user.userId) throw new Error("Unauthorized");

    await db.insert(userBackgrounds).values(background);
    revalidateTag(`backgrounds-${user.userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error while uploading a user background";
    return { error: errorMessage };
  }
};
