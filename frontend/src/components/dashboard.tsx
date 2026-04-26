import { KanbanView } from "@/components/kanban-view";
import { Navbar } from "@/components/navbar";

export function Dashboard() {
  return (
    <div className="w-full">
      <div className="flex justify-center pt-4">
        <Navbar />
      </div>
      <KanbanView />
    </div>
  );
}
