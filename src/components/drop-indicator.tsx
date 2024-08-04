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
      className="h-1.5 w-full rounded-sm bg-primary-600 py-1 opacity-0"
    />
  );
};

export default DropIndicator;
