"use server";

import { createUserData } from "./create-user-data";
import { getUserData } from "./get-user-data";
// TODO : fix error logic
// Not use error object?
export const getOrCreateUserData = async (userId: string) => {
  try {
    const existingUserData = await getUserData(userId);
    if (!existingUserData.data) {
      await createUserData(userId);
    }
    return existingUserData;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error while getting/creating user data";
    return { error: errorMessage };
  }
};
