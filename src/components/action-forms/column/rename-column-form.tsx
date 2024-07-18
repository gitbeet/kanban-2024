import {
  type ChangeEvent,
  FormEvent,
  useRef,
  useState,
  useTransition,
} from "react";
import { useFormStatus } from "react-dom";
import { renameColumnAction } from "~/actions";
import InputField from "~/components/ui/input-field";
import { EditButton } from "~/components/ui/submit-button";
import { useBoards } from "~/context/boards-context";
import useClickOutside from "~/hooks/useClickOutside";
import { ColumnSchema } from "~/zod-schemas";

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

  const [newColumnName, setNewColumnName] = useState(column?.name);
  const [error, setError] = useState("");
  const [_, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const renameColumnRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const handleColumnNameChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setError("");
    setNewColumnName(e.target.value);
  };

  const clientAction = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = ColumnSchema.shape.name.safeParse(newColumnName);
    if (!result.success) {
      return setError(result.error.issues[0]?.message ?? "An error occured");
    }
    startTransition(() => {
      setOptimisticBoards({
        action: "renameColumn",
        boardId,
        columnId,
        newColumnName,
      });
    });
    setNewColumnName("");
    setIsOpen(false);
    const response = await renameColumnAction(columnId, newColumnName);
    if (response?.error) {
      return setError(response.error);
    }
    setLoading(false);
  };

  return (
    <div ref={ref} className={`${loading ? "pointer-events-none" : ""}`}>
      <form
        ref={renameColumnRef}
        onSubmit={clientAction}
        className="flex flex-col"
      >
        {!isOpen && (
          <input
            readOnly
            className="input-readonly w-full p-2"
            onClick={() => {
              setIsOpen(true);
              setNewColumnName(column?.name);
            }}
            value={column?.name}
          ></input>
        )}
        {isOpen && (
          <>
            <input
              className="input w-full"
              autoFocus
              type="text"
              value={newColumnName ?? ""}
              onChange={handleColumnNameChange}
            />
            <p>{error}</p>
            <button type="submit" className="hidden" />
          </>
        )}
      </form>
    </div>
  );
};

export default RenameColumnForm;
