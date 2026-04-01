import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KanbanView } from "@/components/kanban-view";

export function Dashboard() {
  return (
    <div>
      <KanbanView />
    </div>
  );
}
