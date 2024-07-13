"use client";

import React, { type FormEvent, useOptimistic, useRef, useState } from "react";
import type { ColumnType, TaskType, BoardType } from "../types";
import Board from "./board";
import SubmitButton from "./ui/submit-button";
import { v4 as uuid } from "uuid";
import { useUser } from "@clerk/nextjs";
import { createBoardAction } from "~/actions";
import SelectBoard from "./select-board";

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
        oldColumnId,
        newColumnId,
        newColumnIndex,
        taskId,
        columnId,
        taskIndex,
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
        oldColumnId?: string;
        newColumnId?: string;
        newColumnIndex?: number;
        taskId?: string;
        columnId?: string;
        taskIndex?: string;
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
          if (board && columnId && taskId && taskIndex) {
            console.log("In if");
            return state.map((b) =>
              b.id === board.id
                ? {
                    ...b,
                    columns: b.columns.map((c) =>
                      c.id === columnId
                        ? {
                            ...c,
                            tasks: c.tasks
                              .filter((t) => t.id !== taskId)
                              .map((t) =>
                                t.index > parseInt(taskIndex)
                                  ? { ...t, index: t.index - 1 }
                                  : t,
                              ),
                          }
                        : c,
                    ),
                  }
                : b,
            );
          } else {
            console.log("Error");
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
        case "switchTaskColumn":
          if (
            board?.id &&
            column &&
            taskId &&
            oldColumnId &&
            newColumnId &&
            newColumnIndex &&
            taskIndex
          ) {
            const currentBoard = state.find((b) => b.id === board.id);
            const currentColumn = currentBoard?.columns.find(
              (col) => col.id === oldColumnId,
            );
            const currentTask = currentColumn?.tasks.find(
              (task) => task.id === taskId,
            );
            if (!currentTask) return state;
            if (oldColumnId === newColumnId) {
              return state.map((b) => {
                return b.id === board.id
                  ? {
                      ...b,
                      columns: b.columns.map((c) => {
                        return c.id === column.id
                          ? {
                              ...c,
                              tasks: c.tasks.map((t) => {
                                if (t.id === taskId) {
                                  return { ...t, index: newColumnIndex };
                                } else if (t.index >= newColumnIndex) {
                                  return { ...t, index: t.index + 1 };
                                } else {
                                  return t;
                                }
                              }),
                            }
                          : c;
                      }),
                    }
                  : b;
              });
            }

            return state.map((b) => {
              if (b.id !== board.id) return b;

              return {
                ...b,
                columns: b.columns.map((c) => {
                  if (c.id === oldColumnId) {
                    return {
                      ...c,
                      tasks: c.tasks
                        .map((t) =>
                          t.index > parseInt(taskIndex)
                            ? { ...t, index: t.index - 1 }
                            : t,
                        )
                        .filter((t) => t.id !== taskId),
                    };
                  } else if (c.id === newColumnId) {
                    const newTask: TaskType = {
                      ...currentTask,
                      index: newColumnIndex - 1,
                      updatedAt: new Date(),
                    };
                    const newTasks = [...c.tasks];
                    newTasks.splice(newColumnIndex, 0, newTask);
                    return {
                      ...c,
                      tasks: newTasks.map((t) =>
                        t.index > newColumnIndex
                          ? { ...t, index: t.index + 1 }
                          : t,
                      ),
                    };
                  }
                  return c;
                }),
              };
            });
          }

          break;
        default:
          break;
      }
      return state;
    },
  );

  const [currentBoardId, setCurrentBoardId] = useState<string | null>(
    optimisticBoards?.[0]?.id ?? null,
  );

  const currentBoard = optimisticBoards.find(
    (board) => board.id === currentBoardId,
  );

  const selectBoards = optimisticBoards.map(({ id, name }) => ({ id, name }));

  const handleBoardChange = (e: FormEvent<HTMLSelectElement>) => {
    setCurrentBoardId(e.currentTarget.value);
  };

  if (!user?.id) return <h1>please log in (placeholder error message)</h1>;

  return (
    <div className="space-y-16">
      <section className="flex items-center gap-4">
        <SelectBoard boards={selectBoards} onChange={handleBoardChange} />
        <form
          ref={createBoardRef}
          action={async (formData: FormData) => {
            const maxIndex = Math.max(...boards.map((b) => b.index));
            createBoardRef.current?.reset();
            const name = formData.get("board-name-input") as string;
            const newBoard: BoardType = {
              id: uuid(),
              index: maxIndex + 1,
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
        </form>
      </section>
      <section className="flex gap-32">
        {currentBoard && (
          <Board
            board={currentBoard}
            key={currentBoard.index}
            setOptimistic={setOptimisticBoards}
          />
        )}
      </section>
    </div>
  );
};

export default Boards;
