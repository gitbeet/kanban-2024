import React from "react";
import { type TaskType } from "../types";

const Task = ({ task }: { task: TaskType }) => {
  return (
    <p key={task.id}>
      <span className="pr-2">{task.completed ? "v" : "x"}</span>
      {task.name}
    </p>
  );
};

export default Task;
