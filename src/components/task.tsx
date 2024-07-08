import React from "react";
import { type TaskType } from "../types";
import SubmitButton from "./ui/submit-button";
import { renameTask } from "~/server/queries";

const Task = ({ task }: { task: TaskType }) => {
  return (
    <>
      <p key={task.id}>
        <span className="pr-2">{task.completed ? "(v)" : "(x)"}</span>
        {task.name}
      </p>
      <form
        action={async () => {
          "use server";
          await renameTask(task.id, "Task rename test");
        }}
      >
        <SubmitButton text="Rename task" />
      </form>
    </>
  );
};

export default Task;
