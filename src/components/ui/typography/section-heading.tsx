import { type ReactElement } from "react";
import VerticalGradientText from "./vertical-gradient-text";

const SectionHeading = ({
  children,
}: {
  children: ReactElement<{ className: string }>;
}) => {
  return (
    <VerticalGradientText>
      <h2 className="text-center text-4xl font-black">{children}</h2>
    </VerticalGradientText>
  );
};

export default SectionHeading;
