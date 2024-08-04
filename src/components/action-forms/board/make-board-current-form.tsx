"use client";
import { useEffect, useState, useTransition } from "react";
import { useBoards } from "~/context/boards-context";
import { handleMakeBoardCurrent } from "~/server/queries";
import { BoardSchema } from "~/zod-schemas";
import type { FormEvent } from "react";
import type { MakeBoardCurrentChange } from "~/types";
import { useUser } from "@clerk/nextjs";

const MakeBoardCurrentForm = ({
  boardId,
  boardName,
}: {
  boardId: string;
  boardName: string;
}) => {
  const {
    setOptimisticBoards,
    getCurrentBoard,
    setLoading: setBoardsLoading,
  } = useBoards();

  const { user } = useUser();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  useEffect(() => {
    setBoardsLoading((prev) => ({ ...prev, makeBoardCurrent: pending }));
  }, [pending, setBoardsLoading]);
  const currentBoardId = getCurrentBoard()?.id;

  const clientAction = async (e?: FormEvent) => {
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
      setOptimisticBoards({ action: "makeBoardCurrent", boardId });
    });
    // server validation
    // server update
    console.log(currentBoardId, boardId);
    const response = await handleMakeBoardCurrent({
      change: {
        action: "makeBoardCurrent",
        newCurrentBoardId: boardId,
        oldCurrentBoardId: currentBoardId!,
      } as MakeBoardCurrentChange,
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
    <span
      onClick={clientAction}
      className={`w-full truncate px-4 py-3 ${boardId === currentBoardId ? "rounded-r-full bg-white text-black" : ""}`}
    >
      {boardName}
    </span>
  );
};

export default MakeBoardCurrentForm;
