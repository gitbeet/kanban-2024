import { type ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  CloseButton,
  DeleteButton,
} from "~/components/ui/button/buttons";
import InputField from "~/components/ui/input-field";
import { ModalWithBackdrop } from "~/components/ui/modal/modal";
import { useUI } from "~/context/ui-context";
import type { BoardType, ColumnType } from "~/types";
import { v4 as uuid } from "uuid";
import { BoardSchema, ColumnSchema } from "~/zod-schemas";
import { mutateTable } from "~/server/queries";
import PromptWindow from "~/components/ui/modal/prompt-window";
import {
  CreateColumnAction,
  DeleteColumnAction,
  RenameBoardAction,
  RenameColumnAction,
  Action,
} from "~/types/actions";

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

const EditBoard = ({ board }: { board: BoardType }) => {
  const { showEditBoardMenu, setShowEditBoardMenu, setShowEditBoardWindow } =
    useUI();
  const [showConfirmCancelWindow, setShowConfirmCancelWindow] = useState(false);
  const [boardName, setBoardName] = useState(board.name);
  const [temporaryColumns, setTemporaryColumns] = useState<ColumnType[]>(
    board.columns,
  );
  const [error, setError] = useState<ErrorType>(
    getInitialErrors(board.columns),
  );
  const [changes, setChanges] = useState<Action[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showEditBoardMenu) return;
    setError(getInitialErrors(board.columns));
    setTemporaryColumns(board.columns);
    // setTemporaryColumns(getInitialTemporaryColumns(board.columns));
    setChanges([]);
  }, [showEditBoardMenu, board.columns]);

  const handleChangeBoardName = (e: ChangeEvent<HTMLInputElement>) => {
    setError((prev) => ({ ...prev, boardName: "" }));
    setBoardName(e.target.value);
    setChanges((prev) => {
      const actionIndex = prev.findIndex(
        (action) =>
          action.type === "RENAME_BOARD" && action.payload.boardId === board.id,
      );
      // If there's already a rename action, don't add another one
      if (actionIndex !== -1) {
        return prev.map((action, i) =>
          i === actionIndex
            ? ({
                ...action,
                payload: { ...action.payload, newBoardName: e.target.value },
              } as RenameBoardAction)
            : action,
        );
      } else {
        return [
          ...prev,
          {
            type: "RENAME_BOARD",
            payload: {
              boardId: board.id,
              newBoardName: e.target.value,
            },
          } satisfies RenameBoardAction,
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
        (action) =>
          action.type === "CREATE_COLUMN" &&
          action.payload.column.id === newColumn.id,
      );
      if (actionIndex !== -1) {
        return prev;
      } else {
        return [
          ...prev,
          {
            type: "CREATE_COLUMN",
            payload: {
              column: newColumn,
            },
          } as CreateColumnAction,
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
      const column = temporaryColumns.find((c) => c.id === columnId);
      if (!column) return prev;

      const columnAddActionIndex = prev.findIndex(
        (action) =>
          action.type === "CREATE_COLUMN" &&
          action.payload.column.boardId === board.id &&
          action.payload.column.id === columnId,
      );

      const columnRenameActionIndex = prev.findIndex(
        (action) =>
          action.type === "RENAME_COLUMN" &&
          action.payload.columnId === columnId,
      );

      if (columnAddActionIndex !== -1) {
        return prev.map((action) =>
          action.type === "CREATE_COLUMN" &&
          action.payload.column.id === columnId
            ? ({
                ...action,
                payload: {
                  column: { ...column, name: e.target.value },
                },
              } satisfies CreateColumnAction)
            : action,
        );
      } else if (columnRenameActionIndex !== -1) {
        return prev.map((action, i) =>
          i === columnRenameActionIndex && action.type === "RENAME_COLUMN"
            ? { ...action, columnId, newName: e.target.value }
            : action,
        );
      } else {
        return [
          ...prev,
          {
            type: "RENAME_COLUMN",
            payload: {
              boardId: board.id,
              columnId,
              newColumnName: e.target.value,
            },
          } satisfies RenameColumnAction,
        ];
      }
    });
  };

  const handleDeleteColumn = (columnId: string, columnIndex: number) => {
    setChanges((prev) => {
      // Check if the subtask was added since the menu was opened
      const wasAdded =
        changes.findIndex(
          (action) =>
            action.type === "CREATE_COLUMN" &&
            action.payload.column.id === columnId,
        ) !== -1;
      const actionIndex = prev.findIndex(
        (action) =>
          action.type === "DELETE_COLUMN" &&
          action.payload.columnId === columnId,
      );
      // If it was added since the menu was opened -> clear all actions that have to do with said subtask (if we added it , renamed it then deleted it before saving the changes it means we don't query the db at all )
      if (wasAdded) {
        return prev.filter((action) => {
          if (action.type === "RENAME_COLUMN") {
            return action.payload.columnId !== columnId;
          }
          if (action.type === "CREATE_COLUMN") {
            return action.payload.column.id !== columnId;
          }
          return true;
        });
      }

      if (actionIndex !== -1 && !wasAdded) {
        return prev;
      } else {
        // If we still don't have a action entry for the delete of this subtask and we haven't added it since the menu was opened -> add the delete action entry and remove the rename (we don't need to rename the task if we are to delete it in the same query)
        return [
          ...prev.filter((action) => {
            if (action.type === "RENAME_COLUMN") {
              return action.payload.columnId !== columnId;
            }
            return true;
          }),
          {
            type: "DELETE_COLUMN",
            payload: { boardId: board.id, columnId },
          } satisfies DeleteColumnAction,
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
    setTemporaryColumns(board.columns);
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
