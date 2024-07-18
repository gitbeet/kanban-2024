import React from "react";

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
    <div
      // data-before --> task id ("-1" for the one below the last task)
      data-before-id={beforeId}
      data-before-index={beforeIndex}
      // data-column --> for specifying which indicators we should get (by column)
      data-column-id={columnId}
      className="my-1 h-1.5 w-full rounded-xl bg-indigo-400 opacity-0"
    >
      {beforeIndex}
    </div>
  );
};

export default DropIndicator;
