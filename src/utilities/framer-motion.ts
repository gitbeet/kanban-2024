import type { Variants, Transition } from "framer-motion";

export const sidebarTransition: Transition = {
  duration: 0.4,
  ease: [0.04, 0.62, 0.23, 0.98],
};
export const modalTransition: Transition = {
  duration: 0.3,
  ease: [0.04, 0.62, 0.23, 0.98],
};
export const smallElementTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 28,
};

export const slideButtonsRightVariants: Variants = {
  initial: { opacity: 0, x: -4 },
  animate: { opacity: 1, x: 0 },
};

export const slideFormDownVariants: Variants = {
  initial: { opacity: 0, y: -3 },
  animate: { opacity: 1, y: 0 },
};
