import { type ChangeEvent, useRef, useState } from "react";
import { renameColumnAction } from "~/actions";
import InputField from "~/components/ui/input-field";
import { EditButton } from "~/components/ui/submit-button";
import { useBoards } from "~/context/boards-context";
import type { BoardType, ColumnType } from "~/types";
import { BoardSchema, ColumnSchema } from "~/zod-schemas";

const RenameColumnForm = ({
  boardId,
  columnId,
}: {
  boardId: string;
  columnId: string;
}) => {
  const renameColumnRef = useRef<HTMLFormElement>(null);
  const [newColumnName, setNewColumnName] = useState("");
  const [error, setError] = useState("");
  const { setOptimisticBoards } = useBoards();

  const handleColumnNameChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setError("");
    setNewColumnName(e.target.value);
  };

  const clientAction = async () => {
    // Client error check
    const result = ColumnSchema.shape.name.safeParse(newColumnName);
    if (!result.success) {
      return setError(result.error.issues[0]?.message ?? "An error occured");
    }
    setOptimisticBoards({
      action: "renameColumn",
      boardId,
      columnId,
      newColumnName,
    });
    const response = await renameColumnAction(columnId, newColumnName);
    if (response?.error) {
      return setError(response.error);
    }
  };

  return (
    <form
      className="flex items-center"
      ref={renameColumnRef}
      action={clientAction}
    >
      <input type="hidden" name="column-id" value={columnId} />
      <InputField
        type="text"
        name="column-name-input"
        value={newColumnName}
        error={error}
        onChange={handleColumnNameChange}
        placeholder="Column name..."
      />
      <EditButton />
    </form>
  );
};

export default RenameColumnForm;
