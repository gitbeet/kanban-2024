import React, { type ChangeEvent, useRef, useState } from "react";
import type { ColumnType } from "~/types";
import { v4 as uuid } from "uuid";
import { createColumnAction } from "~/actions";
import { CreateButton } from "~/components/ui/submit-button";
import { ColumnSchema } from "~/zod-schemas";
import InputField from "~/components/ui/input-field";
import { motion } from "framer-motion";
import { useBoards } from "~/context/boards-context";
const CreateColumnForm = ({
  boardId,
  jsx = "input",
}: {
  boardId: string;
  jsx?: "input" | "block";
}) => {
  const createColumnRef = useRef<HTMLFormElement>(null);
  const { setOptimisticBoards, optimisticBoards } = useBoards();

  const [columnName, setColumnName] = useState("");
  const [error, setError] = useState("");
  const [active, setActive] = useState(false);

  const currentBoard = optimisticBoards.find((board) => board.id === boardId);
  if (!currentBoard)
    return <h1>Error finding the current board (placeholder error)</h1>;

  const clientAction = async () => {
    const maxIndex = Math.max(...currentBoard.columns.map((c) => c.index));
    createColumnRef.current?.reset();
    const newColumn: ColumnType = {
      id: uuid(),
      index: maxIndex + 1,
      boardId: boardId,
      name: columnName,
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = ColumnSchema.safeParse(newColumn);
    if (!result.success) {
      return setError(result.error.issues[0]?.message ?? "An error occured");
    }

    setOptimisticBoards({ action: "createColumn", boardId, column: newColumn });

    const response = await createColumnAction(newColumn);
    if (response?.error) {
      return setError(response.error);
    }

    setActive(false);
  };

  const handleColumnName = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setError("");
    setColumnName(e.target.value);
  };

  return (
    <>
      {jsx === "input" && (
        <form className="flex" ref={createColumnRef} action={clientAction}>
          <input type="hidden" name="board-id" value={boardId} />
          <InputField
            value={columnName}
            onChange={handleColumnName}
            type="text"
            name="column-name-input"
            placeholder="Create column..."
            error={error}
          />

          <CreateButton />
        </form>
      )}
      {jsx === "block" && (
        <motion.div
          layout
          onClick={() => setActive(true)}
          className="grid h-max w-80 shrink-0 cursor-pointer place-content-center rounded-md bg-neutral-800"
        >
          {!active && <p className="text-xl font-medium">+Column</p>}
          {active && (
            <form className="flex" ref={createColumnRef} action={clientAction}>
              <InputField
                value={columnName}
                onChange={handleColumnName}
                type="text"
                name="column-name-input"
                placeholder="Create column..."
                error={error}
              />

              <CreateButton />
            </form>
          )}
        </motion.div>
      )}
    </>
  );
};

export default CreateColumnForm;
