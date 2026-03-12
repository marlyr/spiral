import type { Skill, SkillStatus } from "@/types";
import { KanbanBoard } from "@/components/kanban-board";

export function KanbanView() {
    // TODO: replace with request
    const skills: Skill[] = [
        { id: 1, name: "Forward Swizzles", track: "basic", level: 1, bonus: false, status: "not_started" },
        { id: 2, name: "Backward Crossovers", track: "basic", level: 1, bonus: false, status: "working_on" },
        { id: 3, name: "Waltz Jump", track: "basic", level: 1, bonus: false, status: "completed" },
        { id: 4, name: "Waltz Jump", track: "basic", level: 1, bonus: false, status: "completed" },
    ]

    return (
        <div>
            {[1, 2, 3, 4, 5, 6].map((level) => (
            <KanbanBoard key={level} skills={skills.filter(s => s.level === level)} level={level} />
            ))}
        </div>
    )
}