import { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

const Section = ({
  variant = "primary",
  children,
  className,
  ...props
}: Props) => {
  const variantClass =
    variant === "primary"
      ? "bg-neutral-25 dark:bg-neutral-900"
      : "border-y border-neutral-100 bg-white  dark:border-neutral-750 dark:bg-neutral-850";

  return (
    <div className={variantClass}>
      <section
        className={`section-padding container py-16 md:py-20 ${className}`}
        {...props}
      >
        {children}
      </section>
    </div>
  );
};

export default Section;
