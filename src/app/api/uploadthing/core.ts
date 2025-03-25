import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = auth();
      const { userId } = user;
      if (!userId) throw new UploadThingError("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { key, ufsUrl } = file;
      const { userId } = metadata;
      const background = {
        fileKey: key,
        fileUrl: ufsUrl,
        userId,
      };
      return background;
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
