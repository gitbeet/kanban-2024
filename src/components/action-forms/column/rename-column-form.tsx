import { type ChangeEvent, useRef, useState } from "react";
import { renameColumnAction } from "~/actions";
import InputField from "~/components/ui/input-field";
import { EditButton } from "~/components/ui/submit-button";
import type { BoardType, ColumnType, SetOptimisticType } from "~/types";
import { ColumnSchema } from "~/zod-schemas";

const RenameColumnForm = ({
  board,
  column,
  setOptimistic,
}: {
  board: BoardType;
  column: ColumnType;
  setOptimistic: SetOptimisticType;
}) => {
  const renameColumnRef = useRef<HTMLFormElement>(null);
  const [newColumnName, setNewColumnName] = useState("");
  const [error, setError] = useState("");

  const handleColumnNameChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setError("");
    setNewColumnName(e.target.value);
  };
  return (
    <form
      className="flex items-center"
      ref={renameColumnRef}
      action={async (formData: FormData) => {
        const name = formData.get("column-name-input") as string;
        const renamedColumn: ColumnType = {
          ...column,
          name,
          updatedAt: new Date(),
        };

        // Client error check
        const result = ColumnSchema.safeParse(renamedColumn);
        if (!result.success) {
          return setError(
            result.error.issues[0]?.message ?? "An error occured",
          );
        }
        setOptimistic({
          action: "renameColumn",
          board,
          column: renamedColumn,
        });
        const response = await renameColumnAction(renamedColumn);
        if (response?.error) {
          return setError(response.error);
        }
      }}
    >
      <input type="hidden" name="column-id" value={column.id} />
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
