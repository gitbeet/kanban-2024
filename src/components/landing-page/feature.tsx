import Image, { type StaticImageData } from "next/image";
import Text from "../ui/typography/text";

const Feature = ({
  heading,
  body,
  icon,
}: {
  heading: string;
  body: string;
  icon: StaticImageData;
}) => {
  return (
    <article className="flex w-full max-w-[500px] flex-col items-center space-y-4 p-8 lg:rounded-lg lg:border lg:border-neutral-100 lg:bg-white lg:shadow-lg lg:shadow-neutral-250/20 lg:dark:border-neutral-800 lg:dark:bg-neutral-850 lg:dark:shadow-neutral-950/5">
      <div className="h-20 w-20 rounded-full p-2">
        <Image src={icon} height={60} width={60} alt="idea" />
      </div>
      <Text variant="primary">
        <h3 className="text-center text-2xl font-black">{heading}</h3>
      </Text>
      <Text variant="secondary">
        <p className="text-center font-light">{body}</p>
      </Text>
    </article>
  );
};

export default Feature;
