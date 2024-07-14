import React, { type ChangeEvent, useRef, useState } from "react";
import type { BoardType, ColumnType, SetOptimisticType } from "~/types";
import { v4 as uuid } from "uuid";
import { createColumnAction } from "~/actions";
import { CreateButton } from "~/components/ui/submit-button";
import { ColumnSchema } from "~/zod-schemas";
import InputField from "~/components/ui/input-field";

const CreateColumnForm = ({
  board,
  setOptimistic,
}: {
  board: BoardType;
  setOptimistic: SetOptimisticType;
}) => {
  const createColumnRef = useRef<HTMLFormElement>(null);

  const [columnName, setColumnName] = useState("");
  const [error, setError] = useState("");

  const clientAction = async (formData: FormData) => {
    const maxIndex = Math.max(...board.columns.map((c) => c.index));
    createColumnRef.current?.reset();
    const name = formData.get("column-name-input") as string;
    const newColumn: ColumnType = {
      id: uuid(),
      index: maxIndex + 1,
      boardId: board.id,
      name,
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = ColumnSchema.safeParse(newColumn);
    if (!result.success) {
      return setError(result.error.issues[0]?.message ?? "An error occured");
    }

    setOptimistic({ action: "createColumn", board, column: newColumn });

    const response = await createColumnAction(newColumn);
    if (response?.error) {
      return setError(response.error);
    }
  };

  const handleColumnName = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setError("");
    setColumnName(e.target.value);
  };

  return (
    <form className="flex" ref={createColumnRef} action={clientAction}>
      <input type="hidden" name="board-id" value={board.id} />
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
  );
};

export default CreateColumnForm;
