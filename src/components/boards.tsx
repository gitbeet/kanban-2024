"use client";

import React, { useOptimistic, useRef } from "react";
import { ColumnType, TaskType, type BoardType } from "../types";
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
        column,
        task,
      }: {
        action:
          | "createBoard"
          | "renameBoard"
          | "deleteBoard"
          | "createColumn"
          | "renameColumn"
          | "deleteColumn"
          | "createTask"
          | "renameTask"
          | "deleteTask"
          | "toggleTask"
          | "switchTaskColumn";
        board?: BoardType;
        column?: ColumnType;
        task?: TaskType;
      },
    ) => {
      switch (action) {
        case "createBoard":
          if (board) {
            return [...state, board];
          }
          break;
        case "renameBoard":
          if (board) {
            return state.map((b) =>
              b.id === board.id ? { ...b, name: board.name } : b,
            );
          }
          break;
        case "deleteBoard":
          if (board) {
            return state.filter((b) => b.id !== board.id);
          }
          break;
        case "createColumn":
          if (board?.id && column) {
            return state.map((b) =>
              b.id === board.id ? { ...b, columns: [...b.columns, column] } : b,
            );
          }
          break;
        case "renameColumn":
          if (board?.id && column) {
            return state.map((b) =>
              b.id === board.id
                ? {
                    ...b,
                    columns: b.columns.map((c) =>
                      c.id === column.id ? { ...c, name: column.name } : c,
                    ),
                  }
                : b,
            );
          }
          break;
        case "deleteColumn":
          if (board?.id && column) {
            return state.map((b) =>
              b.id === board.id
                ? { ...b, columns: b.columns.filter((c) => c.id !== column.id) }
                : b,
            );
          }
          break;
        case "createTask":
          if (board?.id && column && task) {
            return state.map((b) =>
              b.id === board.id
                ? {
                    ...b,
                    columns: b.columns.map((c) =>
                      c.id === column.id
                        ? { ...c, tasks: [...c.tasks, task] }
                        : c,
                    ),
                  }
                : b,
            );
          }
          break;
        case "renameTask":
          if (board?.id && column && task) {
            return state.map((b) =>
              b.id === board.id
                ? {
                    ...b,
                    columns: b.columns.map((c) =>
                      c.id === column.id
                        ? {
                            ...c,
                            tasks: c.tasks.map((t) =>
                              t.id === task.id ? { ...t, name: task.name } : t,
                            ),
                          }
                        : c,
                    ),
                  }
                : b,
            );
          }
          break;
        case "deleteTask":
          if (board?.id && column && task) {
            return state.map((b) =>
              b.id === board.id
                ? {
                    ...b,
                    columns: b.columns.map((c) =>
                      c.id === column.id
                        ? {
                            ...c,
                            tasks: c.tasks.filter((t) => t.id !== task.id),
                          }
                        : c,
                    ),
                  }
                : b,
            );
          }
          break;
        case "toggleTask":
          if (board?.id && column && task) {
            return state.map((b) =>
              b.id === board.id
                ? {
                    ...b,
                    columns: b.columns.map((c) =>
                      c.id === column.id
                        ? {
                            ...c,
                            tasks: c.tasks.map((t) =>
                              t.id === task.id
                                ? { ...t, completed: !t.completed }
                                : t,
                            ),
                          }
                        : c,
                    ),
                  }
                : b,
            );
          }
          break;
        // case "switchTaskColumn":
        //   if (board?.id && column && task) {
        //     const { sourceColumnId, targetColumnId } = column;
        //     return state.map((b) => {
        //       if (b.id !== board.id) return b;
        //       return {
        //         ...b,
        //         columns: b.columns.map((c) => {
        //           if (c.id === sourceColumnId) {
        //             return {
        //               ...c,
        //               tasks: c.tasks.filter((t) => t.id !== task.id),
        //             };
        //           } else if (c.id === targetColumnId) {
        //             return {
        //               ...c,
        //               tasks: [...c.tasks, task],
        //             };
        //           }
        //           return c;
        //         }),
        //       };
        //     });
        //   }
        //   break;
        default:
          break;
      }
      return state; // Ensure the function always returns the current state
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
          setOptimisticBoards({ action: "createBoard", board: newBoard });
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
