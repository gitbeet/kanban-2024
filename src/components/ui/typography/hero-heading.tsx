import { type ReactNode } from "react";
import VerticalGradientText from "./vertical-gradient-text";

const HeroHeading = ({
  children,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <VerticalGradientText>
      <h1 className={`text-5xl font-black md:text-6xl`}>{children}</h1>
    </VerticalGradientText>
  );
};

export default HeroHeading;
