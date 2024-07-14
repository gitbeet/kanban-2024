import { NextResponse } from "next/server";
import { getBoards } from "~/server/queries";

export const GET = async () => {
  try {
    const boards = await getBoards();
    return NextResponse.json(boards);
  } catch (error) {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
};
