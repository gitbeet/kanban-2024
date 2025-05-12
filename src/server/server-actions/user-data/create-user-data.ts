"use server";

import { v4 as uuid } from "uuid";
import { db } from "~/server/db";
import { userDatas } from "~/server/db/schema";
import type { UserDataType } from "~/types";

export const createUserData = async (userId: string) => {
  try {
    const userData: UserDataType = {
      id: uuid(),
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      currentBackgroundId: null,
      backgroundOpacity: 100,
      backgroundBlur: 0,
      performanceMode: false,
      currentBoardId: null,
    };
    const data = await db.insert(userDatas).values(userData);
    return { data: data.rows };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error while creating user data";
    return { error: errorMessage };
  }
};
