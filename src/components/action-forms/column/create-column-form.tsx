import { useEffect, useRef, useState, useTransition } from "react";
import useClickOutside from "~/hooks/useClickOutside";
import { useBoards } from "~/context/boards-context";
import { v4 as uuid } from "uuid";
import { handleCreateColumn } from "~/server/queries";
import { CancelButton, SaveButton } from "~/components/ui/button/buttons";
import InputField from "~/components/ui/input-field";
import { ColumnSchema } from "~/zod-schemas";
import { FaPlus } from "react-icons/fa6";
import type { ColumnType } from "~/types";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import FocusTrap from "focus-trap-react";
import { handlePressEscape } from "~/utilities/handlePressEscape";
import { handlePressEnter } from "~/utilities/handlePressEnter";

interface CreateColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  boardId: string;
}

const CreateColumnForm = ({ boardId, ...props }: CreateColumnProps) => {
  const createColumnRef = useRef<HTMLFormElement | null>(null);
  const notOpenJsxRef = useRef<HTMLButtonElement | null>(null);

  const { setOptimisticBoards, getCurrentBoard } = useBoards();

  const [columnName, setColumnName] = useState("");
  const [loading, setLoading] = useState(false);
  const [pending, startTransition] = useTransition();

  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { ref } = useClickOutside<HTMLDivElement>(handleClickOutside);
  const currentBoard = getCurrentBoard();

  // useEffect(() => {
  //   if (!isOpen && notOpenJsxRef.current) {
  //     notOpenJsxRef.current.focus(); // Focus the button when isOpen becomes false
  //   }
  // }, [isOpen]);

  if (!currentBoard)
    return <h1>Error finding the current board (placeholder error)</h1>;

  const clientAction = async (e?: FormEvent) => {
    e?.preventDefault();
    setLoading(true);
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
      setError(result.error.issues[0]?.message ?? "An error occured");
      setLoading(false);

      return;
    }
    startTransition(() => {
      setOptimisticBoards({
        action: "createColumn",
        boardId,
        column: newColumn,
      });
    });

    const response = await handleCreateColumn({
      change: {
        action: "createColumn",
        boardId: boardId,
        columnName: newColumn.name,
        columnId: newColumn.id,
      },
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
    if (!isOpen) return;
    setIsOpen(false);
    setColumnName("");
    setError("");
    setLoading(false);
    notOpenJsxRef.current!.focus();
  }

  const handlePressEnterToEdit = async (e: KeyboardEvent) => {
    if (isOpen) {
      handlePressEscape(e, handleClickOutside);
    } else {
      await handlePressEnter(e, () => {
        setIsOpen(true);
        setColumnName("");
      });
    }
  };

  const notOpenJsx = (
    <button
      ref={notOpenJsxRef}
      onClick={() => setIsOpen(true)}
      className={` ${isOpen ? "pointer-events-none h-0 w-0 opacity-0" : "opacity-100"} text-secondary--hoverable flex items-center gap-2`}
    >
      <FaPlus className="h-3.5 w-3.5" />
      <span className="text-lg font-bold">Column</span>
    </button>
  );

  const openJsx = (
    <FocusTrap active={isOpen} focusTrapOptions={{ escapeDeactivates: false }}>
      <form
        ref={createColumnRef}
        onSubmit={clientAction}
        className="flex items-center gap-2 p-1.5"
      >
        <InputField
          autoFocus
          value={columnName}
          onChange={handleColumnChangeName}
          type="text"
          placeholder="Enter column name"
          className="w-full"
          error={error}
          // handleCancel={handleClickOutside}
          // handleSubmit={clientAction}
        />
        <div className="flex gap-1.5">
          <SaveButton disabled={!!error} />
          <CancelButton onClick={handleClickOutside} />
        </div>
      </form>
    </FocusTrap>
  );

  return (
    <div
      onKeyDown={handlePressEnterToEdit}
      ref={ref}
      className={` ${loading ? "pointer-events-none" : ""} grid cursor-pointer place-content-center p-4 ${props.className}`}
    >
      {notOpenJsx}
      {isOpen && openJsx}
    </div>
  );
};

export default CreateColumnForm;
