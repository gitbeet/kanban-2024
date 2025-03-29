// import { Webhook } from 'svix';
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { getOrCreateUserData } from "~/server/queries";

export async function POST(req: Request) {
  //   const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  //   if (!WEBHOOK_SECRET) {
  //     throw new Error("CLERK_WEBHOOK_SECRET is not set");
  //   }

  const payload: WebhookEvent = await req.json();
  console.log(payload);

  // Handle user creation event
  //   if (evt.type === 'user.created') {
  //     const { id } = evt.data;
  //     try {
  //       await getOrCreateUserData(id);
  //     } catch (error) {
  //       console.error('Error creating user data:', error);
  //     }
  //   }

  //   return new Response('', { status: 200 });
  return Response.json({ message: "Received" });
}

export async function GET() {
  return Response.json({ message: "Hello World!" });
}
