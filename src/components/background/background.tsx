import { usePathname } from "next/navigation";
import Image from "next/image";

import { useBackground } from "~/context/bg-context";

const Background = () => {
  const pathname = usePathname();
  const isBoardsPage = pathname === "/boards";
  const { background, imageOpacity } = useBackground();
  if (!isBoardsPage) return null;

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
          className="z-10 min-h-full object-cover object-center opacity-80 dark:opacity-60"
          src={background.value ?? ""}
          alt="text for the image"
        />
      )}
      {background.type === "user" && (
        <img
          style={{ opacity: imageOpacity / 100 }}
          className="z-10 min-h-full object-cover opacity-80 dark:opacity-60"
          src={background.fileUrl ?? ""}
          alt="text for the image"
        />
      )}
    </div>
  );
};

export default Background;
