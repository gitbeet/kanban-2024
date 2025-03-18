import { usePathname } from "next/navigation";
import Image from "next/image";

import { useBackground, backgrounds } from "~/context/bg-context";

const Background = () => {
  const pathname = usePathname();
  const isBoardsPage = pathname === "/boards";
  const { background, imageOpacity } = useBackground();
  if (!isBoardsPage) return null;
  const resolvedBackground = backgrounds.find((b) => b.slug === background);
  if (!resolvedBackground) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {resolvedBackground?.type === "color" && (
        <div
          style={{ opacity: imageOpacity / 100 }}
          className={`absolute inset-0 ${resolvedBackground.value}`}
        />
      )}
      {resolvedBackground?.type === "image" && (
        <Image
          style={{ opacity: imageOpacity / 100 }}
          className="z-10 min-h-full object-cover object-center opacity-80 dark:opacity-60"
          src={resolvedBackground.value ?? ""}
          alt="text for the image"
        />
      )}
    </div>
  );
};

export default Background;
