import { type ReactNode } from "react";
import Text from "./text";

const SectionSubheading = ({ children }: { children: ReactNode }) => {
  return (
    <Text variant="secondary">
      <p className="text-center text-lg font-light">{children}</p>
    </Text>
  );
};

export default SectionSubheading;
