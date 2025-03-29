import { relations, sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  timestamp,
  varchar,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `kanban-2024_${name}`);

// ---------- MODELS ----------

// ** BOARDS **

export const boards = createTable(
  "board",
  {
    id: varchar("id", { length: 1024 }).primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    userId: varchar("userId", { length: 256 }).notNull(),
    index: integer("index").notNull(),
    current: boolean("current").notNull().default(false),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("board_name_idx").on(example.name),
  }),
);

export const columns = createTable(
  "column",
  {
    id: varchar("id", { length: 1024 }).primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    boardId: varchar("boardId", { length: 1024 })
      .references(() => boards.id, { onDelete: "cascade" })
      .notNull(),
    index: integer("index").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("column_name_idx").on(example.name),
  }),
);

export const tasks = createTable(
  "task",
  {
    id: varchar("id", { length: 1024 }).primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    columnId: varchar("columnId", { length: 1024 })
      .references(() => columns.id, { onDelete: "cascade" })
      .notNull(),
    index: integer("index").notNull(),
    completed: boolean("completed").notNull().default(false),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("task_name_idx").on(example.name),
  }),
);

export const subtasks = createTable(
  "subtask",
  {
    id: varchar("id", { length: 1024 }).primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    taskId: varchar("taskId", { length: 1024 })
      .references(() => tasks.id, { onDelete: "cascade" })
      .notNull(),
    index: integer("index").notNull(),
    completed: boolean("completed").notNull().default(false),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("subtask_name_idx").on(example.name),
  }),
);

// ** BACKGROUNDS **

export const backgrounds = createTable("background", {
  id: varchar("id", { length: 1024 }).primaryKey(),
  type: varchar("type").notNull().$type<"color" | "image">(),
  slug: varchar("slug").notNull().unique(),
  title: varchar("title").notNull(),
  value: varchar("value").notNull(),
  alt: varchar("alt").notNull(),
});

export const userBackgrounds = createTable("user_background", {
  id: varchar("id", { length: 1024 }).primaryKey(),
  userId: varchar("userId", { length: 256 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 256 }).notNull(),
  fileKey: varchar("fileKey", { length: 256 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// ** USER DATA **

export const userDatas = createTable("user_data", {
  id: varchar("id", { length: 1024 }).primaryKey(),
  userId: varchar("userId", { length: 256 }).unique().notNull(),
  currentBoardId: varchar("current_board_id", { length: 256 }),
  currentBackgroundId: varchar("background_id", { length: 256 }),
  backgroundOpacity: integer("background_opacity"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

//---------- RELATIONS ----------

export const boardRelations = relations(boards, ({ many }) => ({
  columns: many(columns),
}));

export const columnsRelations = relations(columns, ({ one, many }) => ({
  board: one(boards, {
    fields: [columns.boardId],
    references: [boards.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  column: one(columns, {
    fields: [tasks.columnId],
    references: [columns.id],
  }),
  subtasks: many(subtasks),
}));

export const subtaskRelations = relations(subtasks, ({ one }) => ({
  task: one(tasks, {
    fields: [subtasks.taskId],
    references: [tasks.id],
  }),
}));
