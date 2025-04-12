import { useRef, useState, useTransition } from "react";
import { useBoards } from "~/context/boards-context";
import { v4 as uuid } from "uuid";
import { handleCreateColumn } from "~/server/queries";
import InputField from "~/components/ui/input/input-field";
import { ColumnSchema } from "~/zod-schemas";
import type { ColumnType } from "~/types";
import type { ChangeEvent, FormEvent } from "react";
import FocusTrap from "focus-trap-react";
import { type CreateColumnAction } from "~/types/actions";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";
import { motion } from "framer-motion";
import {
  slideButtonsRightVariants,
  slideFormDownVariants,
  smallElementTransition,
} from "~/utilities/framer-motion";
import AddButton from "~/components/ui/button/add-button";
import CancelButton from "~/components/ui/button/cancel-button";
import SaveButton from "~/components/ui/button/save-button";
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
    });
    if (response?.error) {
      showCustomErrorToast({ message: response.error });
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
    <div
      className={` ${!isOpen ? "opacity-100" : "pointer-events-none h-0 w-0 opacity-0"} `}
    >
      <AddButton text="Add a column" onClick={() => setIsOpen(true)} />
    </div>
  );

  const openJsx = (
    <motion.form
      variants={slideFormDownVariants}
      initial="initial"
      animate="animate"
      transition={smallElementTransition}
      ref={createColumnRef}
      onSubmit={clientAction}
      className="flex items-center gap-2"
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
        shiftLayout={false}
        error={error}
      />
      <div>
        <motion.div
          layout
          variants={slideButtonsRightVariants}
          initial="initial"
          animate="animate"
          transition={{ ...smallElementTransition, delay: 0.1 }}
          className="flex gap-1.5"
        >
          <SaveButton disabled={!!error} />
          <CancelButton onClick={handleClickOutside} />
        </motion.div>
      </div>
    </motion.form>
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
