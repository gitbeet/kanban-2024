import { type WebhookEvent } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { getOrCreateUserData } from "~/server/queries";

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as WebhookEvent;

    const eventType = payload.type;
    if (eventType !== "session.created") throw new Error("Wrong event");
    // change to payload.data.id when changing event type to create
    const userId = payload.data.user_id;
    if (!userId) throw new Error("No user ID");
    await getOrCreateUserData(userId);
    console.log("success");
    return NextResponse.json({ message: "Received" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Hello World!" });
}
