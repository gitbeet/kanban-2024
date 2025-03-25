ALTER TABLE "kanban-2024_backgrounds" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "kanban-2024_backgrounds" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "kanban-2024_backgrounds" ALTER COLUMN "created_at" SET NOT NULL;