CREATE TABLE "kanban-2024_backgrounds" (
	"id" varchar(1024) PRIMARY KEY NOT NULL,
	"userId" varchar(256) NOT NULL,
	"fileUrl" varchar(256) NOT NULL,
	"fileKey" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kanban-2024_board" (
	"id" varchar(1024) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"userId" varchar(256) NOT NULL,
	"index" integer NOT NULL,
	"current" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "kanban-2024_column" (
	"id" varchar(1024) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"boardId" varchar(1024) NOT NULL,
	"index" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "kanban-2024_subtask" (
	"id" varchar(1024) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"taskId" varchar(1024) NOT NULL,
	"index" integer NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "kanban-2024_task" (
	"id" varchar(1024) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"columnId" varchar(1024) NOT NULL,
	"index" integer NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "kanban-2024_column" ADD CONSTRAINT "kanban-2024_column_boardId_kanban-2024_board_id_fk" FOREIGN KEY ("boardId") REFERENCES "public"."kanban-2024_board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kanban-2024_subtask" ADD CONSTRAINT "kanban-2024_subtask_taskId_kanban-2024_task_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."kanban-2024_task"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kanban-2024_task" ADD CONSTRAINT "kanban-2024_task_columnId_kanban-2024_column_id_fk" FOREIGN KEY ("columnId") REFERENCES "public"."kanban-2024_column"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "board_name_idx" ON "kanban-2024_board" USING btree ("name");--> statement-breakpoint
CREATE INDEX "column_name_idx" ON "kanban-2024_column" USING btree ("name");--> statement-breakpoint
CREATE INDEX "subtask_name_idx" ON "kanban-2024_subtask" USING btree ("name");--> statement-breakpoint
CREATE INDEX "task_name_idx" ON "kanban-2024_task" USING btree ("name");