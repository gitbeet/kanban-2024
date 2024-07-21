import { motion } from "framer-motion";

const DropIndicator = ({
  beforeId,
  columnId,
  beforeIndex,
}: {
  beforeId: string;
  beforeIndex: string;
  columnId: string;
}) => {
  return (
    <motion.div
      layout
      // data-before --> task id ("-1" for the one below the last task)
      data-before-id={beforeId}
      data-before-index={beforeIndex}
      // data-column --> for specifying which indicators we should get (by column)
      data-column-id={columnId}
      className="h-1.5 w-full rounded-xl border border-dashed border-neutral-500 bg-neutral-400/10 py-1 opacity-0"
    />
  );
};

export default DropIndicator;
