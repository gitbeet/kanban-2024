import { useRef, useState, useTransition } from "react";
import { useBoards } from "~/context/boards-context";
import useClickOutside from "~/hooks/useClickOutside";
import { handleRenameColumn } from "~/server/queries";
import InputField from "~/components/ui/input-field";
import { ColumnSchema } from "~/zod-schemas";
import type { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";
import { type RenameColumnAction } from "~/types/actions";
import { CancelButton, SaveButton } from "~/components/ui/button/buttons";
import FocusTrap from "focus-trap-react";

const RenameColumnForm = ({
  boardId,
  columnId,
  isFormOpen,
  setIsFormOpen,
}: {
  boardId: string;
  columnId: string;
  isFormOpen: boolean;
  setIsFormOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { setOptimisticBoards, getCurrentBoard } = useBoards();

  const currentBoard = getCurrentBoard();
  const column = currentBoard?.columns.find((col) => col.id === columnId);

  const [newColumnName, setNewColumnName] = useState(column?.name ?? "");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
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
      setIsFormOpen(false);
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
    setIsFormOpen(false);
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
    setIsFormOpen(false);
    setNewColumnName(column?.name ?? "");
    setError("");
    setLoading(false);
  }

  const resolvedTabIndex = isFormOpen ? 0 : -1;

  return (
    <FocusTrap
      active={isFormOpen}
      focusTrapOptions={{
        escapeDeactivates: true,
        allowOutsideClick: true,
        onDeactivate: handleClickOutside,
        clickOutsideDeactivates: true,
      }}
    >
      <div ref={ref} className={`${loading ? "pointer-events-none" : ""} `}>
        <>
          <form
            ref={renameColumnRef}
            onSubmit={clientAction}
            className="relative"
          >
            {!isFormOpen && (
              <>
                <button
                  aria-label="Click to rename the column"
                  onClick={() => {
                    setIsFormOpen(true);
                    setNewColumnName(column?.name ?? "");
                  }}
                  className="input-readonly w-full text-left"
                >
                  <p>{column?.name}</p>
                </button>
              </>
            )}
            {isFormOpen && (
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
              </>
            )}
            <div
              className={`absolute right-0 flex items-center justify-end gap-1.5 pt-1 ${isFormOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"} transition`}
            >
              <SaveButton
                tabIndex={resolvedTabIndex}
                type="submit"
                disabled={!!error}
              />
              <CancelButton
                tabIndex={resolvedTabIndex}
                onClick={handleClickOutside}
              />
            </div>
          </form>
        </>
      </div>
    </FocusTrap>
  );
};

export default RenameColumnForm;
