"use client";
import { useEffect, useState, useTransition } from "react";
import { useBoards } from "~/context/boards-context";
import { handleMakeBoardCurrent } from "~/server/queries";
import { BoardSchema } from "~/zod-schemas";
import type { FormEvent, HTMLAttributes } from "react";
import { useUser } from "@clerk/nextjs";
import { MdDashboard } from "react-icons/md";
import { MakeBoardCurrentAction } from "~/types/actions";

interface Props extends HTMLAttributes<HTMLButtonElement> {
  boardId: string;
  boardName: string;
}

const MakeBoardCurrentForm = ({ boardId, boardName, ...props }: Props) => {
  const {
    setOptimisticBoards,
    getCurrentBoard,
    setLoading: setBoardsLoading,
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
      setError("No currentboardId");
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
    // client update
    startTransition(() => {
      setOptimisticBoards({
        type: "MAKE_BOARD_CURRENT",
        payload: {
          oldCurrentBoardId: currentBoardId,
          newCurrentBoardId: boardId,
        },
      });
    });
    // server validation
    // server update
    const response = await handleMakeBoardCurrent({
      action: {
        type: "MAKE_BOARD_CURRENT",
        payload: {
          newCurrentBoardId: boardId,
          oldCurrentBoardId: currentBoardId,
        },
      } as MakeBoardCurrentAction,
      userId: user?.id,
      revalidate: true,
    });
    if (response?.error) {
      setError(response.error);
      console.log("Server error");
      return;
    }
  };

  return (
    <button
      aria-label={`Switch to the ${boardName} board`}
      onClick={clientAction}
      className={`w-full rounded-r-full px-6 py-3.5 transition-colors duration-150 ${boardId === currentBoardId ? "bg-primary-700 text-white hover:bg-primary-650" : "text-light"} my-1 text-sm font-semibold`}
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
