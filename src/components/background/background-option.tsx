import { type BackgroundType } from "~/types/background";
import BackgroundOptionThumbnail from "./background-option-thumbnail";
import Text from "../ui/typography/text";

const BackgroundOption = ({
  background,
  tabIndex = 0,
}: {
  background: BackgroundType;
  tabIndex?: number;
}) => {
  const { title } = background;
  return (
    <div className="group text-center">
      <BackgroundOptionThumbnail
        backgroundData={background}
        tabIndex={tabIndex}
      />
      <div className="relative">
        <p className="pointer-events-none opacity-0">{title}</p>
        <Text variant="secondary">
          <p className="text-light absolute inset-0 text-center text-sm transition group-hover:!opacity-0">
            {title}
          </p>
        </Text>
        <Text variant="primary">
          <p className="text-dark absolute inset-0 text-center text-sm opacity-0 transition group-hover:opacity-100">
            {title}
          </p>
        </Text>
      </div>
    </div>
  );
};

export default BackgroundOption;
