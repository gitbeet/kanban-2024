import { useUser } from "@clerk/nextjs";
import { startTransition } from "react";
import type { ClientUploadedFileData } from "uploadthing/types";
import type { UploadUserBackgroundAction } from "~/types/actions";
import { v4 as uuid } from "uuid";
import { useBackground } from "~/context/bg-context";
import { uploadUserBackground } from "~/server/queries";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";
import { UploadButton } from "~/utilities/uploadthing";
import { type UserBackgroundType } from "~/types/background";
const UploadBackground = () => {
  const user = useUser();
  const { setOptimisticUserBackgrounds } = useBackground();
  const handleUpload = async (
    res: ClientUploadedFileData<{
      fileKey: string;
      fileUrl: string;
      userId: string;
    }>[],
  ) => {
    if (!res[0] || !user.user?.id) return;
    const { key, ufsUrl } = res[0];
    const background: UserBackgroundType = {
      createdAt: new Date(),
      id: uuid(),
      fileKey: key,
      fileUrl: ufsUrl,
      userId: user.user.id,
    };

    const action: UploadUserBackgroundAction = {
      type: "UPLOAD_USER_BACKGROUND",
      payload: { background },
    };

    startTransition(() => {
      setOptimisticUserBackgrounds(action);
    });

    const result = await uploadUserBackground(action);
    if (result?.error) {
      showCustomErrorToast({ message: result.error });
    }
  };

  return (
    <UploadButton
      appearance={{
        button:
          "border border-neutral-250 dark:border-neutral-650 text-dark hover:border-neutral-350 hover:dark:border-neutral-500  ut-uploading:cursor-not-allowed  w-full rounded-sm h-[63px] transition ",
        container: "w-28  flex flex-col justify-between rounded-sm group",
        allowedContent: " text-light h-12 mb-2",
      }}
      // content={{
      // button({ ready, isUploading }) {
      //   if (ready) return <FiUpload className="h-5 w-5" />;
      //   if (isUploading) return <LoadingSpinner size={20} />;
      // },
      // allowedContent({ ready, fileTypes, isUploading }) {
      //   if (!ready) return "Checking what you allow";
      //   if (isUploading) return "Seems like stuff is uploading";
      //   return `Stuff you can upload: ${fileTypes.join(", ")}`;
      // },
      // }}
      endpoint="imageUploader"
      onClientUploadComplete={(res) => handleUpload(res)}
      onUploadError={(error: Error) =>
        showCustomErrorToast({ message: error.message })
      }
    />
  );
};

export default UploadBackground;
