"use client";
import { useEffect, useState, useTransition } from "react";
import { useBoards } from "~/context/boards-context";
import { handleMakeBoardCurrent } from "~/server/queries";
import { BoardSchema } from "~/zod-schemas";
import type { FormEvent, HTMLAttributes } from "react";
import { useUser } from "@clerk/nextjs";
import { MdDashboard } from "react-icons/md";
import { type MakeBoardCurrentAction } from "~/types/actions";
import { showCustomErrorToast } from "~/utilities/showCustomErrorToast";
import { boards } from "~/server/db/schema";

interface Props extends HTMLAttributes<HTMLButtonElement> {
  boardId: string;
  boardName: string;
}

const MakeBoardCurrentForm = ({ boardId, boardName, ...props }: Props) => {
  const {
    setOptimisticBoards,
    getCurrentBoard,
    setBoardsLoading,
    boardsLoading,
  } = useBoards();

  const { user } = useUser();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  useEffect(() => {
    setBoardsLoading((prev) => ({ ...prev, MAKE_BOARD_CURRENT: pending }));
  }, [pending, setBoardsLoading]);
  const currentBoardId = getCurrentBoard()?.id;

  const clientAction = async (e?: FormEvent) => {
    if (!currentBoardId) {
      showCustomErrorToast({ message: "Client error" });
      return;
    }
    e?.preventDefault();
    if (!user?.id) return;

    // client validation
    const result = BoardSchema.shape.id.safeParse(boardId);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Client validation error");
      console.log("Client error");
      return;
    }

    const action: MakeBoardCurrentAction = {
      type: "MAKE_BOARD_CURRENT",
      payload: {
        oldCurrentBoardId: currentBoardId,
        newCurrentBoardId: boardId,
      },
    };

    // client update
    startTransition(() => {
      setOptimisticBoards(action);
    });
    // server validation
    // server update
    const response = await handleMakeBoardCurrent({
      action,
      revalidate: true,
    });
    if (response?.error) {
      showCustomErrorToast({ message: response.error });
    }
  };

  return (
    <button
      disabled={
        boardsLoading.createBoard ||
        boardsLoading.deleteBoard ||
        boardsLoading.makeBoardCurrent
      }
      aria-label={`Switch to the ${boardName} board`}
      onClick={clientAction}
      className={`w-full px-6 py-3.5 transition-colors duration-150 ${boardId === currentBoardId ? "hover:bg-neutral-600 bg-neutral-700 text-white dark:bg-neutral-50 dark:text-neutral-800 dark:hover:bg-white" : "text-secondary--hoverable"} my-1 text-sm font-semibold disabled:opacity-50`}
      {...props}
    >
      <p className="flex items-center gap-2">
        <MdDashboard />
        <span className="truncate"> {boardName}</span>
      </p>
    </button>
  );
};

export default MakeBoardCurrentForm;
