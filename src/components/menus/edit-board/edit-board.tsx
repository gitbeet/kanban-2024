import { type ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  CloseButton,
  DeleteButton,
} from "~/components/ui/button/buttons";
import InputField from "~/components/ui/input-field";
import { ModalWithBackdrop } from "~/components/ui/modal/modal";
import { useUI } from "~/context/ui-context";
import type { BoardType, Change, ColumnType } from "~/types";
import { v4 as uuid } from "uuid";
import { BoardSchema, ColumnSchema } from "~/zod-schemas";
import { mutateTable } from "~/server/queries";
import PromptWindow from "~/components/ui/modal/prompt-window";

type ErrorType = {
  boardName: string;
  columns: { id: string; errorMessage: string }[];
};

const getInitialErrors = (columns: ColumnType[]) => {
  return {
    boardName: "",
    columns: columns.map((c) => ({ id: c.id, errorMessage: "" })),
  };
};

const getInitialTemporaryColumns = (columns: ColumnType[]) => {
  return columns.map(({ id, index, name }) => ({
    id,
    index,
    name,
  }));
};

const EditBoard = ({ board }: { board: BoardType }) => {
  const { showEditBoardMenu, setShowEditBoardMenu, setShowEditBoardWindow } =
    useUI();
  const [showConfirmCancelWindow, setShowConfirmCancelWindow] = useState(false);
  const [boardName, setBoardName] = useState(board.name);
  const [temporaryColumns, setTemporaryColumns] = useState(
    getInitialTemporaryColumns(board.columns),
  );
  const [error, setError] = useState<ErrorType>(
    getInitialErrors(board.columns),
  );
  const [changes, setChanges] = useState<Change[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showEditBoardMenu) return;
    setError(getInitialErrors(board.columns));
    setTemporaryColumns(getInitialTemporaryColumns(board.columns));
    setChanges([]);
  }, [showEditBoardMenu, board.columns]);

  const handleChangeBoardName = (e: ChangeEvent<HTMLInputElement>) => {
    setError((prev) => ({ ...prev, boardName: "" }));
    setBoardName(e.target.value);
    setChanges((prev) => {
      const actionIndex = prev.findIndex(
        (change) =>
          change.action === "renameBoard" && change.boardId === board.id,
      );
      // If there's already a rename action, don't add another one
      if (actionIndex !== -1) {
        return prev.map((change, i) =>
          i === actionIndex ? { ...change, newName: e.target.value } : change,
        );
      } else {
        return [
          ...prev,
          {
            action: "renameBoard",
            boardId: board.id,
            // use e.target.value as state updates async and can be one letter behind
            newName: e.target.value,
          },
        ];
      }
    });
  };

  const handlecreateColumn = () => {
    const maxIndex = temporaryColumns.length;

    const newColumn: ColumnType = {
      id: uuid(),
      boardId: board.id,
      tasks: [],
      index: maxIndex + 1,
      name: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setChanges((prev) => {
      const actionIndex = prev.findIndex(
        (change) =>
          change.action === "createColumn" && change.columnId === newColumn.id,
      );
      if (actionIndex !== -1) {
        return prev;
      } else {
        return [
          ...prev,
          {
            action: "createColumn",
            boardId: board.id,
            columnId: newColumn.id,
            columnName: "",
          },
        ];
      }
    });

    setTemporaryColumns((prev) => [...prev, newColumn]);
    setError((prev) => ({
      ...prev,
      columns: [...prev.columns, { id: newColumn.id, errorMessage: "" }],
    }));
  };

  const handleChangeColumnName = (
    e: ChangeEvent<HTMLInputElement>,
    columnId: string,
  ) => {
    setError((prev) => ({
      ...prev,
      columns: prev.columns.map((s) =>
        s.id === columnId ? { ...s, errorMessage: "" } : s,
      ),
    }));

    setTemporaryColumns((prev) =>
      prev.map((s) => (s.id === columnId ? { ...s, name: e.target.value } : s)),
    );
    setChanges((prev) => {
      const columnAddActionIndex = prev.findIndex(
        (change) =>
          change.action === "createColumn" &&
          change.boardId === board.id &&
          //   FIX ACTION PAYLOAD
          change.columnId === columnId,
      );

      const columnRenameActionIndex = prev.findIndex(
        (change) =>
          change.action === "renameColumn" && change.columnId === columnId,
      );

      if (columnAddActionIndex !== -1) {
        return prev.map((change) =>
          change.action === "createColumn" && change.columnId === columnId
            ? {
                ...change,
                boardId: board.id,
                columnName: e.target.value,
              }
            : change,
        );
      } else if (columnRenameActionIndex !== -1) {
        return prev.map((change, i) =>
          i === columnRenameActionIndex && change.action === "renameColumn"
            ? { ...change, columnId, newName: e.target.value }
            : change,
        );
      } else {
        return [
          ...prev,
          {
            action: "renameColumn",
            columnId,
            newName: e.target.value,
          },
        ];
      }
    });
  };

  const handleDeleteColumn = (columnId: string, columnIndex: number) => {
    setChanges((prev) => {
      // Check if the subtask was added since the menu was opened
      const wasAdded =
        changes.findIndex(
          (change) =>
            change.action === "createColumn" && change.columnName === columnId,
        ) !== -1;
      const actionIndex = prev.findIndex(
        (change) =>
          change.action === "deleteColumn" && change.columnId === columnId,
      );
      // If it was added since the menu was opened -> clear all actions that have to do with said subtask (if we added it , renamed it then deleted it before saving the changes it means we don't query the db at all )
      if (wasAdded) {
        return prev.filter((change) => {
          if (change.action === "renameColumn") {
            return change.columnId !== columnId;
          }
          if (change.action === "createColumn") {
            return change.columnId !== columnId;
          }
          return true;
        });
      }

      if (actionIndex !== -1 && !wasAdded) {
        return prev;
      } else {
        // If we still don't have a action entry for the delete of this subtask and we haven't added it since the menu was opened -> add the delete action entry and remove the rename (we don't need to rename the task if we are to delete it in the same query)
        return [
          ...prev.filter((change) => {
            if (change.action === "renameColumn") {
              return change.columnId !== columnId;
            }
            return true;
          }),
          {
            action: "deleteColumn",
            columnId,
          },
        ];
      }
    });

    setTemporaryColumns((prev) =>
      prev
        .map((c) => (c.index > columnIndex ? { ...c, index: c.index - 1 } : c))
        .filter((s) => s.id !== columnId),
    );
  };

  const handleSaveChanges = async () => {
    if (!changes.length) {
      setShowEditBoardMenu(false);
      setShowEditBoardWindow(false);
      return;
    }
    setLoading(true);
    // -------------- CLIENT VALIDATION START --------------

    // Use local variable as state changes async and can validate wrongly when errors are present
    let validated = true;

    // Task name  validation
    const nameValidationResult = BoardSchema.shape.name.safeParse(boardName);
    if (!nameValidationResult.success) validated = false;
    const nameValidationErrorMessage =
      nameValidationResult.error?.issues[0]?.message ?? "";
    setError((prev) => ({ ...prev, name: nameValidationErrorMessage }));

    // Subtask  validations
    temporaryColumns.forEach((column) => {
      const result = ColumnSchema.shape.name.safeParse(column.name);
      if (!result.success) validated = false;
      const errorMessage = result.error?.issues[0]?.message ?? "";
      setError((prev) => ({
        ...prev,
        columns: prev.columns.map((e) =>
          e.id === column.id ? { ...e, errorMessage } : e,
        ),
      }));
    });

    if (!validated) return setLoading(false);
    // -------------- CLIENT VALIDATION END --------------

    const response = await mutateTable(changes);
    if (response?.error) {
      console.log(response.error);
    }
    setLoading(false);
    handleCloseWindow();
    // when saving close the small menu aswell
    setShowEditBoardWindow(false);
  };

  const handleCloseWindow = () => {
    setShowEditBoardMenu(false);
    setShowConfirmCancelWindow(false);
    setLoading(false);
    setError(getInitialErrors(board.columns));
    setTemporaryColumns(getInitialTemporaryColumns(board.columns));
    setChanges([]);
  };

  const handleShowConfirmationWindow = () => {
    if (!changes.length) return handleCloseWindow();
    setShowConfirmCancelWindow(true);
  };

  const confirmCancelWindowJSX = (
    <>
      <PromptWindow
        zIndex={60}
        show={showEditBoardMenu && showConfirmCancelWindow}
        showBackdrop={showEditBoardMenu && showConfirmCancelWindow}
        onClose={() => setShowConfirmCancelWindow(false)}
        message={
          <span>
            Are you sure you want to cancel your changes? All unsaved progress
            will be lost.
          </span>
        }
        confirmButton={
          <Button onClick={handleCloseWindow} type="submit" variant="danger">
            Discard Changes
          </Button>
        }
        cancelButton={
          <Button
            onClick={() => setShowConfirmCancelWindow(false)}
            variant="ghost"
          >
            Go Back
          </Button>
        }
      />
    </>
  );

  return (
    <>
      {confirmCancelWindowJSX}
      <ModalWithBackdrop
        zIndex={50}
        show={showEditBoardMenu}
        showBackdrop={showEditBoardMenu}
        onClose={handleShowConfirmationWindow}
      >
        <div className="text-dark relative space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">Edit Board</h1>
            <CloseButton onClick={handleShowConfirmationWindow} />
          </div>
          {/* -----  ----- */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold">Board Name</h4>
            <InputField
              error={error.boardName}
              value={boardName}
              id="board-title"
              onChange={handleChangeBoardName}
              className="w-full"
              errorPlacement="bottom"
            />
          </div>
          {/* -----  ----- */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold">Columns</h3>
            <ul className="space-y-2.5">
              {temporaryColumns
                .sort((a, b) => a.index - b.index)
                .map((c) => {
                  const errorIndex = error.columns.findIndex(
                    (col) => col.id === c.id,
                  );
                  return (
                    <div key={c.index} className="flex items-center gap-2">
                      <InputField
                        className="w-full"
                        value={c.name}
                        error={error.columns[errorIndex]?.errorMessage ?? ""}
                        onChange={(e) => handleChangeColumnName(e, c.id)}
                        errorPlacement="bottom"
                        shiftLayout
                      />
                      <DeleteButton
                        className={`${error.columns[errorIndex]?.errorMessage ? "relative -top-2.5" : ""}`}
                        type="button"
                        onClick={() => handleDeleteColumn(c.id, c.index)}
                      />
                    </div>
                  );
                })}
            </ul>
            <Button
              variant="primary"
              className="w-full"
              onClick={handlecreateColumn}
            >
              Add new column
            </Button>
          </div>

          <div className="space-y-4">
            <Button
              disabled={!changes.length || loading}
              loading={loading}
              type="button"
              variant="primary"
              className="w-full"
              onClick={handleSaveChanges}
            >
              Save changes
            </Button>
            <Button
              loading={loading}
              disabled={loading}
              type="button"
              variant="danger"
              className="w-full"
              onClick={handleShowConfirmationWindow}
            >
              Cancel
            </Button>
          </div>
        </div>
      </ModalWithBackdrop>
    </>
  );
};

export default EditBoard;
