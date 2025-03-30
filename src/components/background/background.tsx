import { usePathname } from "next/navigation";

import { useBackground } from "~/context/bg-context";
import type { BlurValue } from "./blur-toggle";

const blurClassMap: Record<BlurValue, string> = {
  none: "blur-none",
  sm: "blur-sm",
  md: "blur-md",
  lg: "blur-lg",
  xl: "blur-xl",
};

const Background = () => {
  const pathname = usePathname();
  const isBoardsPage = pathname === "/boards";
  const { background, imageOpacity, imageBlur } = useBackground();
  if (!isBoardsPage) return null;

  const blurClass = blurClassMap[imageBlur];

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {background.type === "color" && (
        <div
          style={{ opacity: imageOpacity / 100 }}
          className={`absolute inset-0 ${background.value}`}
        />
      )}
      {background.type === "image" && (
        <img
          style={{ opacity: imageOpacity / 100 }}
          className={` ${blurClass} z-10 min-h-full object-cover object-center`}
          src={background.value ?? ""}
          alt="text for the image"
        />
      )}
      {background.type === "user" && (
        <img
          style={{ opacity: imageOpacity / 100 }}
          className={` ${blurClass} z-10 min-h-full object-cover object-center`}
          src={background.fileUrl ?? ""}
          alt="text for the image"
        />
      )}
    </div>
  );
};

export default Background;
