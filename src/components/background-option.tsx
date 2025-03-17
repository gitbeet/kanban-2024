import Image from "next/image";
import { BackgroundType, useBackground } from "~/context/bg-context";

const BackgroundOption = ({ background }: { background: BackgroundType }) => {
  const { setBackground } = useBackground();
  const { type, value, alt, slug, title } = background;
  return (
    <div className="text-center">
      <div
        onClick={() => setBackground(slug)}
        className={`relative aspect-video w-28 cursor-pointer overflow-hidden rounded shadow`}
      >
        {type === "image" && (
          <Image className="absolute inset-0" src={value} alt={alt} />
        )}
        {type === "color" && (
          <div aria-label={alt} className={`${value} absolute inset-0`} />
        )}
      </div>
      <p className="text-light text-center text-sm">{title}</p>
    </div>
  );
};

export default BackgroundOption;
