import { getBoards } from "~/server/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const boards = await getBoards();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <section className="flex gap-32">
        {boards.map((board) => (
          <div key={board.id}>
            <h2 className="pb-4 text-xl">{board.name}</h2>
            <div className="flex gap-16">
              {board.columns.map((col) => (
                <div key={col.id}>
                  <p className="border-b p-2">{col.name}</p>
                  <div>
                    {col.tasks.map((task) => (
                      <p key={task.id}>
                        <span className="pr-2">
                          {task.completed ? "v" : "x"}
                        </span>
                        {task.name}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
