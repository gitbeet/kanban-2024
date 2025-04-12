import { useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import Text from "./typography/text";

const ExpandMenu = ({
  children,
  header,
  defaultOpen = false,
  tabIndex = 0,
  disabled = false,
}: {
  children: React.ReactNode;
  header: string;
  defaultOpen?: boolean;
  tabIndex?: number;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const menuIcon = <FaChevronUp className={isOpen ? "" : "rotate-180"} />;

  return (
    <section>
      <Text variant="primary">
        <button
          className="flex w-full grow items-center justify-between rounded bg-transparent p-2.5 transition hover:bg-white active:bg-neutral-50 dark:hover:bg-neutral-800 dark:active:bg-neutral-750"
          onClick={() => setIsOpen((prev) => !prev)}
          tabIndex={tabIndex}
          aria-expanded={isOpen}
          disabled={disabled}
        >
          {header} {menuIcon}
        </button>
      </Text>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: {
                opacity: 1,
                height: "auto",
                transition: {
                  duration: 0.3,
                  ease: [0.04, 0.62, 0.23, 0.98],
                },
              },
              collapsed: {
                opacity: 0,
                height: 0,
                transition: {
                  duration: 0.3,
                  ease: [0.04, 0.62, 0.23, 0.98],
                },
              },
            }}
            className="overflow-hidden"
          >
            <div className="px-2 py-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ExpandMenu;
