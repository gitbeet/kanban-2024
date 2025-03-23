import { useRef, useState, useTransition } from "react";
import { useBoards } from "~/context/boards-context";
import { v4 as uuid } from "uuid";
import { handleCreateColumn } from "~/server/queries";
import { CancelButton, SaveButton } from "~/components/ui/button/buttons";
import InputField from "~/components/ui/input-field";
import { ColumnSchema } from "~/zod-schemas";
import { FaPlus } from "react-icons/fa6";
import type { ColumnType } from "~/types";
import type { ChangeEvent, FormEvent } from "react";
import FocusTrap from "focus-trap-react";
import { type CreateColumnAction } from "~/types/actions";

interface CreateColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  boardId: string;
}

const CreateColumnForm = ({ boardId, ...props }: CreateColumnProps) => {
  const createColumnRef = useRef<HTMLFormElement | null>(null);
  const inputFieldRef = useRef<HTMLInputElement>(null);

  const { setOptimisticBoards, getCurrentBoard } = useBoards();

  const [columnName, setColumnName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const currentBoard = getCurrentBoard();

  if (!currentBoard)
    return <h1>Error finding the current board (placeholder error)</h1>;

  const clientAction = async (e?: FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    let maxIndex = Math.max(...currentBoard.columns.map((c) => c.index));
    maxIndex = Math.max(maxIndex, 0);
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

    // client validation

    const columnAlreadyExists =
      currentBoard.columns.findIndex(
        (col) =>
          col.name.toLowerCase().trim() === newColumn.name.toLowerCase().trim(),
      ) !== -1;
    if (columnAlreadyExists) {
      setError("Already exists");
      inputFieldRef.current?.focus();
      return;
    }

    const result = ColumnSchema.safeParse(newColumn);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "An error occured");
      setLoading(false);
      inputFieldRef.current?.focus();
      return;
    }
    //action
    const action: CreateColumnAction = {
      type: "CREATE_COLUMN",
      payload: { column: newColumn },
    };
    // client mutation
    startTransition(() => {
      setOptimisticBoards(action);
    });
    //server validation / mutation
    const response = await handleCreateColumn({
      action,
      revalidate: true,
    });
    if (response?.error) {
      setIsOpen(true);
      setLoading(false);

      setError(response.error);
      return;
    }

    setIsOpen(false);
    setColumnName("");
    setError("");
    setLoading(false);
  };

  const handleColumnChangeName = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setError("");
    setColumnName(e.target.value);
  };

  function handleClickOutside() {
    setIsOpen(false);
    setColumnName("");
    setError("");
    setLoading(false);
  }

  const notOpenJsx = (
    <button
      onClick={() => {
        setIsOpen(true);
      }}
      className={` ${isOpen ? "pointer-events-none h-0 w-0 opacity-0" : "opacity-100"} text-secondary--hoverable flex items-center gap-2`}
    >
      <FaPlus className="h-3.5 w-3.5" />
      <span className="text-lg font-bold">Column</span>
    </button>
  );

  const openJsx = (
    <form
      ref={createColumnRef}
      onSubmit={clientAction}
      className="flex items-center gap-2 p-1.5"
    >
      <InputField
        ref={inputFieldRef}
        autoFocus
        value={columnName}
        onChange={handleColumnChangeName}
        type="text"
        placeholder="Enter column name"
        className="w-full"
        errorPlacement="bottomRight"
        error={error}
      />
      <div>
        <div className="flex gap-1.5">
          <SaveButton disabled={!!error} />
          <CancelButton onClick={handleClickOutside} />
        </div>
      </div>
    </form>
  );

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
      <div
        className={` ${loading ? "pointer-events-none" : ""} grid cursor-pointer place-content-center p-4 ${props.className}`}
      >
        {!isOpen && notOpenJsx}
        {isOpen && openJsx}
      </div>
    </FocusTrap>
  );
};

export default CreateColumnForm;
