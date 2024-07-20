import type { ColumnType } from "~/types";
import type { ChangeEvent, FormEvent } from "react";
import React, { useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { createColumnAction } from "~/actions";
import {
  CancelButton,
  CreateButton,
  SaveButton,
} from "~/components/ui/buttons";
import { ColumnSchema } from "~/zod-schemas";
import InputField from "~/components/ui/input-field";
import { useBoards } from "~/context/boards-context";
import { FaPlus } from "react-icons/fa6";
import useClickOutside from "~/hooks/useClickOutside";
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
  const [isOpen, setIsOpen] = useState(false);
  const { ref } = useClickOutside<HTMLDivElement>(handleClickOutside);
  const currentBoard = optimisticBoards.find((board) => board.id === boardId);
  if (!currentBoard)
    return <h1>Error finding the current board (placeholder error)</h1>;

  function handleClickOutside() {
    setIsOpen(false);
    setColumnName("");
    setError("");
  }

  const clientAction = async (e?: FormEvent) => {
    e?.preventDefault();
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

    setIsOpen(false);

    const result = ColumnSchema.safeParse(newColumn);
    if (!result.success) {
      setIsOpen(true);
      setError(result.error.issues[0]?.message ?? "An error occured");
      return;
    }

    setOptimisticBoards({ action: "createColumn", boardId, column: newColumn });

    const response = await createColumnAction(newColumn);
    if (response?.error) {
      setIsOpen(true);
      setError(response.error);
      return;
    }

    setColumnName("");
    setError("");
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
        <form className="flex" ref={createColumnRef} onSubmit={clientAction}>
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
        <div
          ref={ref}
          className="grid h-32 w-80 shrink-0 cursor-pointer place-content-center rounded-md bg-neutral-700 p-4"
        >
          {!isOpen && (
            <div
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-1"
            >
              <FaPlus className="h-3 w-3" />
              <span className="text-xl font-medium">Column</span>
            </div>
          )}

          {isOpen && (
            <form
              ref={createColumnRef}
              onSubmit={clientAction}
              className="flex items-center gap-2 p-1.5"
            >
              <InputField
                autoFocus
                value={columnName}
                onChange={handleColumnName}
                type="text"
                placeholder="Enter column name"
                className="w-full !bg-neutral-900"
                error={error}
              />
              <div className="flex gap-1.5">
                <SaveButton disabled={!!error} />
                <CancelButton onClick={handleClickOutside} />
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
};

export default CreateColumnForm;
