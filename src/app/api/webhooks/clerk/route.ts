import { type WebhookEvent } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as WebhookEvent;
  console.log(payload);

  return NextResponse.json({ message: "Received" });
}

export async function GET() {
  return NextResponse.json({ message: "Hello World!" });
}
