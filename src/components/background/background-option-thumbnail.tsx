import Image from "next/image";
import { type HTMLAttributes } from "react";
import { useBackground } from "~/context/bg-context";
import { modifyUserData } from "~/server/server-actions/user-data/modify-user-data";
import type { UserBackgroundData, BackgroundType } from "~/types/background";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";

type Props = HTMLAttributes<HTMLButtonElement> & {
  backgroundData: BackgroundType | UserBackgroundData;
};

const BackgroundOptionThumbnail = ({ backgroundData, ...props }: Props) => {
  const { setBackground } = useBackground();
  let lowerCaseTitle = "";
  if (backgroundData.type === "user") {
    lowerCaseTitle = "user defined";
  }
  if (backgroundData.type === "image" || backgroundData.type === "color") {
    lowerCaseTitle =
      backgroundData.title[0]?.toLowerCase() + backgroundData.title.slice(1);
  }
  const ariaLabel = `Switch to the ${lowerCaseTitle} background`;
  const handleClick = async () => {
    if (backgroundData.type === "user") {
      setBackground({
        id: backgroundData.id,
        type: backgroundData.type,
        fileUrl: backgroundData.fileUrl,
      });
    }
    if (backgroundData.type === "color") {
      setBackground({
        id: backgroundData.id,
        type: backgroundData.type,
        value: backgroundData.value,
      });
    }
    if (backgroundData.type === "image") {
      setBackground({
        id: backgroundData.id,
        type: backgroundData.type,
        value: backgroundData.value,
      });
    }
    const result = await modifyUserData({
      currentBackgroundId: backgroundData.id,
    });
    if (result?.error) showCustomErrorToast({ message: result.error });
  };
  return (
    <button
      aria-label={ariaLabel}
      className={`relative aspect-video w-28 cursor-pointer overflow-hidden rounded border border-transparent drop-shadow-md transition group-hover:border-neutral-350 dark:group-hover:border-neutral-650`}
      onClick={handleClick}
      {...props}
    >
      {backgroundData.type === "image" && (
        <Image
          width={112}
          height={63}
          className="relative h-full min-w-full object-cover object-center"
          src={backgroundData.value}
          alt={backgroundData.alt}
        />
      )}
      {backgroundData.type === "color" && (
        <div
          aria-label={backgroundData.alt}
          className={`${backgroundData.value} absolute inset-0`}
        />
      )}
      {backgroundData.type === "user" && (
        <Image
          width={112}
          height={63}
          className="relative h-full min-w-full object-cover object-center"
          src={backgroundData.fileUrl}
          alt="User defined"
        />
      )}
    </button>
  );
};

export default BackgroundOptionThumbnail;
