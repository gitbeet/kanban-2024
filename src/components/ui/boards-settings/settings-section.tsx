import { type ReactNode } from "react";
import SettingsHeader from "./settings-header";

const SettingsSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <section className="space-y-9">
      <SettingsHeader title={title} />
      <div className="space-y-6 pl-2">{children}</div>
    </section>
  );
};

export default SettingsSection;
