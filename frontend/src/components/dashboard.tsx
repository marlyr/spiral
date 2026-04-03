import { KanbanView } from "@/components/kanban-view";
import { Navbar } from "@/components/navbar";

export function Dashboard() {
  return (
    <div>
      <div className="flex justify-center">
        <Navbar />
      </div>
      <KanbanView />
    </div>
  );
}
