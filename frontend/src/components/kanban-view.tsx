import type { UserSkill, SkillStatus } from "@/types";
import { KanbanBoard } from "@/components/kanban-board";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export function KanbanView() {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get("/skills/");
        console.log(response);
        setSkills(response.data);
      } catch (error) {
        console.log(error);
        setFetchError(true);
        return;
      }
    })();
  }, []);

  const updateSkillStatus = async (skillId: number, newStatus: SkillStatus) => {
    const oldSkills = skills;
    setSkills((prevSkills) =>
      prevSkills.map((s) =>
        s.id === skillId ? { ...s, status: newStatus } : s,
      ),
    );
    try {
      await api.patch(`/skills/${skillId}`, { status: newStatus });
    } catch (error) {
      setSkills(oldSkills);
      console.error("Failed to update skill status: ", error);
      return;
    }
  };

  return (
    <>
      {fetchError && <h2>Something went wrong</h2>}
      <div>
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <KanbanBoard
            key={level}
            skills={skills.filter((s) => s.level === level)}
            level={level}
            onSkillStatusChange={updateSkillStatus}
          />
        ))}
      </div>
    </>
  );
}
