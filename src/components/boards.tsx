"use client";

import React, { useOptimistic, useRef } from "react";
import { type BoardType } from "../types";
import Board from "./board";
import SubmitButton from "./ui/submit-button";
import { v4 as uuid } from "uuid";
import { useUser } from "@clerk/nextjs";
import { createBoardAction } from "~/actions";
const Boards = ({ boards }: { boards: BoardType[] }) => {
  const createBoardRef = useRef<HTMLFormElement>(null);
  const { user } = useUser();
  const [optimisticBoards, setOptimisticBoards] = useOptimistic(
    boards,
    (
      state,
      {
        action,
        board,
      }: { action: "create" | "rename" | "delete"; board: BoardType },
    ) => {
      if (action === "create") return [...state, board];
      if (action === "rename")
        return state.map((b) =>
          b.id === board.id ? { ...b, name: board.name } : b,
        );
      if (action === "delete") return state.filter((b) => b.id !== board.id);
      return state;
    },
  );

  if (!user?.id) return <h1>please log in (placeholder error message)</h1>;

  return (
    <>
      <form
        ref={createBoardRef}
        action={async (formData: FormData) => {
          createBoardRef.current?.reset();
          const name = formData.get("board-name-input") as string;
          const newBoard: BoardType = {
            id: uuid(),
            name,
            columns: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: user?.id,
          };
          setOptimisticBoards({ action: "create", board: newBoard });
          await createBoardAction(formData);
        }}
      >
        <input
          type="text"
          name="board-name-input"
          className="text-black"
          placeholder="Create board..."
        />
        <SubmitButton text="Create board" />
      </form>{" "}
      <section className="flex gap-32">
        {optimisticBoards.map((board) => (
          <Board
            board={board}
            key={board.id}
            setOptimistic={setOptimisticBoards}
          />
        ))}
      </section>
    </>
  );
};

export default Boards;
