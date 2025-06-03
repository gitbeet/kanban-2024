import type { HTMLAttributes, ReactNode } from "react";

type SectionVariant = "primary" | "secondary";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: SectionVariant;
};

const variantClasses: Record<SectionVariant, string> = {
  primary: "bg-neutral-25 dark:bg-neutral-900",
  secondary:
    "border-y border-neutral-100 bg-white dark:border-neutral-750 dark:bg-neutral-850",
};

const Section = ({
  variant = "primary",
  children,
  className,
  ...props
}: Props) => {
  const variantClass = variantClasses[variant];
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
