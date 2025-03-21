import { useRef, useState, useTransition } from "react";
import { useBoards } from "~/context/boards-context";
import useClickOutside from "~/hooks/useClickOutside";
import { handleRenameColumn } from "~/server/queries";
import InputField from "~/components/ui/input-field";
import { ColumnSchema } from "~/zod-schemas";
import type { ChangeEvent, FormEvent } from "react";

const RenameColumnForm = ({
  boardId,
  columnId,
}: {
  boardId: string;
  columnId: string;
}) => {
  const { setOptimisticBoards, optimisticBoards } = useBoards();

  const column = optimisticBoards
    .find((board) => board.id === boardId)
    ?.columns.find((col) => col.id === columnId);

  const [newColumnName, setNewColumnName] = useState(column?.name ?? "");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const renameColumnRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const { ref } = useClickOutside<HTMLDivElement>(handleClickOutside);

  const handleColumnNameChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setError("");
    setNewColumnName(e.target.value);
  };

  const clientAction = async (e?: FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    const result = ColumnSchema.shape.name.safeParse(newColumnName);
    if (!result.success) {
      return setError(result.error.issues[0]?.message ?? "An error occured");
    }
    startTransition(() => {
      setOptimisticBoards({
        type: "RENAME_COLUMN",
        payload: { boardId, columnId, newColumnName },
      });
    });
    setNewColumnName("");
    setIsOpen(false);

    const response = await handleRenameColumn({
      action: {
        type: "RENAME_COLUMN",
        payload: { columnId, newColumnName, boardId },
      },
      revalidate: true,
    });
    if (response?.error) {
      return setError(response.error);
    }
    setLoading(false);
  };

  function handleClickOutside() {
    setIsOpen(false);
    setNewColumnName(column?.name ?? "");
    setError("");
    setLoading(false);
  }

  return (
    <div ref={ref} className={`${loading ? "pointer-events-none" : ""} `}>
      <form ref={renameColumnRef} onSubmit={clientAction} className="">
        {!isOpen && (
          <>
            <div className="h-1" />
            <button
              aria-label="Click to rename the column"
              onClick={() => {
                setIsOpen(true);
                setNewColumnName(column?.name ?? "");
              }}
              className="input-readonly w-full text-left"
            >
              <p>{column?.name}</p>
            </button>
            <div className="h-6" />
          </>
        )}
        {isOpen && (
          <>
            <InputField
              autoFocus
              value={newColumnName ?? ""}
              onChange={handleColumnNameChange}
              type="text"
              placeholder="Enter column name"
              className="w-full"
              error={error}
              errorPlacement="bottom"
              handleCancel={handleClickOutside}
              handleSubmit={clientAction}
            />

            <button type="submit" className="hidden" />
          </>
        )}
      </form>
    </div>
  );
};

export default RenameColumnForm;
