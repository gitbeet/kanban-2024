import React from "react";

const DropIndicator = ({
  beforeId,
  columnId,
}: {
  beforeId: string;
  columnId: string;
}) => {
  return (
    <div
      // data-before --> task id ("-1" for the one below the last task)
      data-before={beforeId ?? "-1"}
      // data-column --> for specifying which indicators we should get (by column)
      data-column-id={columnId}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    ></div>
  );
};

export default DropIndicator;
