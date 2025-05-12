"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { userDatas } from "~/server/db/schema";
import { UserDataSchema } from "~/utilities/zod-schemas";
import type { UserDataType } from "~/types";
import { revalidateTag } from "next/cache";

export const modifyUserData = async (newData: Partial<UserDataType>) => {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    const result = UserDataSchema.partial().strict().safeParse(newData);
    if (!result.success) throw new Error("Error while modifying user data");
    await db.update(userDatas).set(newData).where(eq(userDatas.userId, userId));
    revalidateTag(`user-data-${userId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error while modifying user data";
    return { error: errorMessage };
  }
};
