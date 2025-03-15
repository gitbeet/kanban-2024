import { type HTMLAttributes } from "react";
import { useUI } from "~/context/ui-context";

const MobileButtonLine = (props: HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    className={`absolute h-0.5 w-6 rounded bg-neutral-950 transition dark:bg-neutral-250 ${props.className}`}
  />
);

const MobileMenuButton = () => {
  const { showMobileMenu, setShowMobileMenu } = useUI();
  return (
    <button
      onClick={() => setShowMobileMenu((prev) => !prev)}
      className="relative h-4 w-6 lg:hidden"
    >
      <MobileButtonLine
        className={`${showMobileMenu ? "top-1/2 rotate-45" : "top-0"}`}
      />
      <MobileButtonLine
        className={`${showMobileMenu ? "opacity-0" : ""} absolute top-1/2`}
      />
      <MobileButtonLine
        className={`${showMobileMenu ? "top-1/2 -rotate-45" : "top-full"}`}
      />
    </button>
  );
};

export default MobileMenuButton;
