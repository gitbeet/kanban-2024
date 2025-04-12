import { type ChangeEvent, startTransition, useEffect, useState } from "react";
import InputField from "~/components/ui/input-field";
import { ModalWithBackdrop } from "~/components/ui/modal/modal";
import { useUI } from "~/context/ui-context";
import type { BoardType, ColumnType } from "~/types";
import { v4 as uuid } from "uuid";
import { BoardSchema, ColumnSchema } from "~/zod-schemas";
import { mutateTable } from "~/server/queries";
import PromptWindow from "~/components/ui/modal/prompt-window";
import type {
  CreateColumnAction,
  DeleteColumnAction,
  RenameBoardAction,
  RenameColumnAction,
} from "~/types/actions";
import { useBoards } from "~/context/boards-context";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";
import { Button } from "~/components/ui/button/button";
import DeleteButton from "~/components/ui/button/delete-button";
import CloseButton from "~/components/ui/button/close-button";

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
  const { optimisticBoards, setOptimisticBoards, getCurrentBoard } =
    useBoards();
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showEditBoardMenu) return;
    setBoardName(board.name);
    setError(getInitialErrors(board.columns));
    setTemporaryColumns(board.columns);
  }, [showEditBoardMenu, board]);

  const getBoardNameAction = () => {
    if (board.name === boardName) return null;
    const action: RenameBoardAction = {
      type: "RENAME_BOARD",
      payload: { boardId: board.id, newBoardName: boardName },
    };
    return action;
  };

  const getColumnActions = () => {
    // find created columns diff
    const createdColumns = temporaryColumns.filter((column) => {
      const didColumnExist =
        board.columns.findIndex((c) => c.id === column.id) !== -1;
      return !didColumnExist;
    });
    // find renamed columns diff
    const oldColumns = temporaryColumns.filter((column) => {
      const didColumnExist =
        board.columns.findIndex((c) => c.id === column.id) !== -1;
      return didColumnExist;
    });
    const renamedColumns = oldColumns.filter((col) => {
      const isRenamed =
        board.columns.findIndex(
          (c) => c.id === col.id && c.name !== col.name,
        ) !== -1;
      return isRenamed;
    });
    // find deleted columns diff
    const deletedColumns = board.columns.filter((col) => {
      const wasDeleted =
        temporaryColumns.findIndex((c) => c.id === col.id) === -1;
      return wasDeleted;
    });
    // create corresponding actions
    const createColumnActions: CreateColumnAction[] = createdColumns.map(
      (column) => ({ type: "CREATE_COLUMN", payload: { column } }),
    );
    const renameColumnActions: RenameColumnAction[] = renamedColumns.map(
      (column) => ({
        type: "RENAME_COLUMN",
        payload: {
          boardId: column.boardId,
          columnId: column.id,
          newColumnName: column.name,
        },
      }),
    );
    const deleteColumnActions: DeleteColumnAction[] = deletedColumns.map(
      (column) => ({
        type: "DELETE_COLUMN",
        payload: { boardId: column.boardId, columnId: column.id },
      }),
    );
    const actions = [
      ...createColumnActions,
      ...renameColumnActions,
      ...deleteColumnActions,
    ];
    return actions;
  };

  const getActions = () => {
    const boardNameAction = getBoardNameAction();
    const columnActions = getColumnActions();
    if (!boardNameAction) return [...columnActions];
    return [boardNameAction, ...columnActions];
  };

  const handleChangeBoardName = (e: ChangeEvent<HTMLInputElement>) => {
    setError((prev) => ({ ...prev, boardName: "" }));
    setBoardName(e.target.value);
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

    // setChanges((prev) => {
    //   const actionIndex = prev.findIndex(
    //     (action) =>
    //       action.type === "CREATE_COLUMN" &&
    //       action.payload.column.id === newColumn.id,
    //   );
    //   if (actionIndex !== -1) {
    //     return prev;
    //   } else {
    //     return [
    //       ...prev,
    //       {
    //         type: "CREATE_COLUMN",
    //         payload: {
    //           column: newColumn,
    //         },
    //       } as CreateColumnAction,
    //     ];
    //   }
    // });

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
    setError(getInitialErrors(temporaryColumns));
    setTemporaryColumns((prev) =>
      prev.map((s) => (s.id === columnId ? { ...s, name: e.target.value } : s)),
    );
  };

  const handleDeleteColumn = (columnId: string, columnIndex: number) => {
    setTemporaryColumns((prev) =>
      prev
        .map((c) => (c.index > columnIndex ? { ...c, index: c.index - 1 } : c))
        .filter((s) => s.id !== columnId),
    );
  };

  const handleSaveChanges = async () => {
    setError(getInitialErrors(temporaryColumns));
    const actions = getActions();
    if (actions.length == 0) {
      setShowEditBoardMenu(false);
      setShowEditBoardWindow(false);
      return;
    }

    setLoading(true);
    // -------------- CLIENT VALIDATION START --------------

    // Use local variable as state changes async and can validate wrongly when errors are present
    let validated = true;

    // Board name  validations
    const currentBoard = getCurrentBoard();
    const boardAlreadyExists =
      optimisticBoards.findIndex(
        (board) =>
          board.name.toLowerCase().trim() === boardName.toLowerCase().trim() &&
          board.id !== currentBoard?.id,
      ) !== -1;
    if (boardAlreadyExists) {
      setError((prev) => ({ ...prev, boardName: "Already exists" }));
      validated = false;
    }
    const nameValidationResult = BoardSchema.shape.name.safeParse(boardName);
    if (!nameValidationResult.success) {
      validated = false;
      const nameValidationErrorMessage =
        nameValidationResult.error?.issues[0]?.message;
      if (nameValidationErrorMessage) {
        setError((prev) => ({
          ...prev,
          boardName: nameValidationErrorMessage,
        }));
      } else {
        setError((prev) => ({ ...prev, boardName: "Error occurred" }));
      }
    }

    // Column  validations
    temporaryColumns.forEach((column) => {
      const nameAlreadyExistsOutside =
        board.columns.findIndex(
          (c) =>
            c.name.toLowerCase().trim() === column.name.toLowerCase().trim() &&
            c.id !== column.id,
        ) !== -1;
      const nameAlreadyExistsInside =
        temporaryColumns.findIndex(
          (c) =>
            c.name.toLowerCase().trim() === column.name.toLowerCase().trim() &&
            c.id !== column.id,
        ) !== -1;
      if (nameAlreadyExistsInside || nameAlreadyExistsOutside) {
        validated = false;
        setError((prev) => ({
          ...prev,
          columns: prev.columns.map((e) =>
            e.id === column.id ? { ...e, errorMessage: "Already exists" } : e,
          ),
        }));
      }

      const result = ColumnSchema.shape.name.safeParse(column.name);
      if (!result.success) {
        validated = false;
        const errorMessage = result.error?.issues[0]?.message ?? "";
        setError((prev) => ({
          ...prev,
          columns: prev.columns.map((e) =>
            e.id === column.id ? { ...e, errorMessage } : e,
          ),
        }));
      }
    });

    if (!validated) {
      setLoading(false);
      return;
    }
    // -------------- CLIENT VALIDATION END --------------

    startTransition(() => {
      actions.forEach((action) => setOptimisticBoards(action));
    });

    // optimistically close?
    setLoading(false);
    handleCloseWindow();
    // when saving close the small menu aswell
    setShowEditBoardWindow(false);

    const response = await mutateTable(actions);
    if (response?.error) {
      showCustomErrorToast({ message: response.error });
    }
  };

  const handleCloseWindow = () => {
    setShowEditBoardMenu(false);
    setShowConfirmCancelWindow(false);
    setLoading(false);
  };

  const handleShowConfirmationWindow = () => {
    const actions = getActions();
    if (actions.length === 0) return handleCloseWindow();
    setShowConfirmCancelWindow(true);
  };

  const actions = getActions();

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
              errorPlacement="bottomRight"
              shiftLayout={false}
              menu
            />
          </div>
          {/* -----  ----- */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold">Columns</h3>
            <ul className="max-h-44 space-y-2.5 overflow-auto p-1 scrollbar-thin">
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
                        shiftLayout
                        menu
                      />
                      <div>
                        <DeleteButton
                          type="button"
                          onClick={() => handleDeleteColumn(c.id, c.index)}
                        />
                        {error.columns[errorIndex]?.errorMessage && (
                          <div className="h-5" />
                        )}
                      </div>
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
              disabled={actions.length === 0 || loading}
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
