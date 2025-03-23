import { useRef, useState, useTransition } from "react";
import { useBoards } from "~/context/boards-context";
import useClickOutside from "~/hooks/useClickOutside";
import { handleRenameColumn } from "~/server/queries";
import InputField from "~/components/ui/input-field";
import { ColumnSchema } from "~/zod-schemas";
import type { ChangeEvent, FormEvent } from "react";
import { type RenameColumnAction } from "~/types/actions";
import { CancelButton, SaveButton } from "~/components/ui/button/buttons";
import FocusTrap from "focus-trap-react";

const RenameColumnForm = ({
  boardId,
  columnId,
}: {
  boardId: string;
  columnId: string;
}) => {
  const { setOptimisticBoards, getCurrentBoard } = useBoards();

  const currentBoard = getCurrentBoard();
  const column = currentBoard?.columns.find((col) => col.id === columnId);

  const [newColumnName, setNewColumnName] = useState(column?.name ?? "");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const renameColumnRef = useRef<HTMLFormElement>(null);
  const { ref } = useClickOutside<HTMLDivElement>(handleClickOutside);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleColumnNameChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setError("");
    setNewColumnName(e.target.value);
  };

  const clientAction = async (e?: FormEvent) => {
    e?.preventDefault();

    // client validations
    if (column?.name.trim() === newColumnName.trim()) {
      setIsOpen(false);
      return;
    }

    const columnAlreadyExists =
      currentBoard?.columns.findIndex(
        (col) =>
          col.name.toLowerCase().trim() ===
            newColumnName.toLowerCase().trim() && col.id !== columnId,
      ) !== -1;
    if (columnAlreadyExists) {
      setError("Already exists");
      inputRef.current?.focus();
      return;
    }

    const result = ColumnSchema.shape.name.safeParse(newColumnName);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "An error occured");
      inputRef.current?.focus();
      return;
    }
    // action
    const action: RenameColumnAction = {
      type: "RENAME_COLUMN",
      payload: { boardId, columnId, newColumnName },
    };
    // client mutation
    startTransition(() => {
      setOptimisticBoards(action);
    });
    setNewColumnName("");
    setIsOpen(false);
    setLoading(true);
    // server validation / mutation
    const response = await handleRenameColumn({
      action,
      revalidate: true,
    });
    if (response?.error) {
      setError(response.error);
      setLoading(false);
      return;
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
    <FocusTrap
      active={isOpen}
      focusTrapOptions={{
        escapeDeactivates: true,
        allowOutsideClick: true,
        onDeactivate: handleClickOutside,
        clickOutsideDeactivates: true,
      }}
    >
      <div ref={ref} className={`${loading ? "pointer-events-none" : ""} `}>
        {!isOpen && (
          <>
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
          </>
        )}
        {isOpen && (
          <form
            ref={renameColumnRef}
            onSubmit={clientAction}
            className="relative"
          >
            <>
              <InputField
                ref={inputRef}
                autoFocus
                value={newColumnName ?? ""}
                onChange={handleColumnNameChange}
                type="text"
                placeholder="Enter column name"
                className="w-full"
                error={error}
                errorPlacement="bottomLeft"
              />
              <div className="absolute -bottom-2 right-0 z-[2] flex translate-y-full gap-1.5">
                <SaveButton type="submit" disabled={!!error} />
                <CancelButton onClick={handleClickOutside} />
              </div>
            </>
          </form>
        )}
      </div>
    </FocusTrap>
  );
};

export default RenameColumnForm;
