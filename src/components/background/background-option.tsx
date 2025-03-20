import Image from "next/image";
import { useBackground } from "~/context/bg-context";
import { BackgroundType } from "~/types/background";

const BackgroundOption = ({
  background,
  tabIndex = 0,
}: {
  background: BackgroundType;
  tabIndex?: number;
}) => {
  const { setBackground } = useBackground();
  const { type, value, alt, slug, title } = background;
  const lowerCaseTitle = title[0]?.toLowerCase() + title.slice(1);
  const ariaLabel = `Switch to the ${lowerCaseTitle} background ${type}`;
  return (
    <div className="group text-center">
      <button
        aria-label={ariaLabel}
        tabIndex={tabIndex}
        onClick={() => setBackground(slug)}
        className={`relative aspect-video w-28 cursor-pointer overflow-hidden rounded border border-transparent drop-shadow-md transition group-hover:border-neutral-350 dark:group-hover:border-neutral-650`}
      >
        {type === "image" && (
          <Image className="absolute inset-0" src={value} alt={alt} />
        )}
        {type === "color" && (
          <div aria-label={alt} className={`${value} absolute inset-0`} />
        )}
      </button>
      <div className="relative">
        <p className="pointer-events-none opacity-0">{title}</p>
        <p className="text-light absolute inset-0 text-center text-sm transition group-hover:!opacity-0">
          {title}
        </p>
        <p className="text-dark absolute inset-0 text-center text-sm opacity-0 transition group-hover:opacity-100">
          {title}
        </p>
      </div>
    </div>
  );
};

export default BackgroundOption;
