import { useUI } from "~/context/ui-context";
import { motion, type Variants, type MotionProps } from "framer-motion";
import { smallElementTransition } from "~/utilities/framer-motion";

type MobileButtonLineProps = MotionProps & { className?: string };

const MobileMenuButtonLine = ({
  className,
  variants,
  ...props
}: MobileButtonLineProps) => (
  <motion.div
    variants={variants}
    initial={false}
    animate="animate"
    transition={smallElementTransition}
    {...props}
    className={`absolute h-0.5 w-6 rounded bg-neutral-950 dark:bg-neutral-250 ${className}`}
  />
);

const MobileMenuButton = () => {
  const { showMobileMenu, setShowMobileMenu } = useUI();

  const topLineVariants: Variants = {
    animate: {
      top: showMobileMenu ? "50%" : 0,
      rotate: showMobileMenu ? 45 : 0,
    },
  };

  const midLineVariants: Variants = {
    animate: {
      top: "50%",
      opacity: showMobileMenu ? 0 : 1,
    },
  };

  const bottomLineVariants: Variants = {
    animate: {
      top: showMobileMenu ? "50%" : "100%",
      rotate: showMobileMenu ? -45 : 0,
    },
  };
  return (
    <button
      onClick={() => setShowMobileMenu((prev) => !prev)}
      className="relative h-4 w-6 lg:hidden"
    >
      <MobileMenuButtonLine variants={topLineVariants} />
      <MobileMenuButtonLine variants={midLineVariants} />
      <MobileMenuButtonLine variants={bottomLineVariants} />
    </button>
  );
};

export default MobileMenuButton;
