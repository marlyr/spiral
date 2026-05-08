import { useEffect, useRef, useState } from "react";
import type { UserSkill, SkillStatus } from "@/types";
import { KanbanColumn } from "@/components/kanban-column";
import { SkillCardBody } from "@/components/skill-card";
import { loadOrder, saveOrder, syncWithParent } from "@/lib/kanban-order";

import {
  DragDropProvider,
  DragOverlay,
  useDragDropMonitor,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

function FloatingCard({ skill }: { skill: UserSkill }) {
  return (
    <div
      className="flex flex-col gap-1 bg-background rounded-lg px-3 py-[10px]"
      style={{
        border: "1px solid var(--primary)",
        boxShadow: "0 10px 28px rgba(0,0,0,0.16), 0 0 0 2px var(--primary)",
      }}
    >
      <SkillCardBody skill={skill} />
    </div>
  );
}

// Inner component — must live inside DragDropProvider to use useDragDropMonitor
function KanbanBoardContent({
  localSkills,
  setLocalSkills,
  recentlyDropped,
}: {
  localSkills: UserSkill[];
  setLocalSkills: React.Dispatch<React.SetStateAction<UserSkill[]>>;
  recentlyDropped: number | null;
}) {
  const lastDragOver = useRef<{
    source: number;
    target: string | number;
  } | null>(null);

  useDragDropMonitor({
    onDragStart: () => {
      lastDragOver.current = null;
    },
    onDragOver: (event) => {
      const source = event.operation.source;
      const target = event.operation.target;
      if (!source || !target) return;

      const sourceId = source.id as number;
      if (target.id === sourceId) return;

      if (
        lastDragOver.current?.source === sourceId &&
        lastDragOver.current?.target === target.id
      )
        return;
      lastDragOver.current = { source: sourceId, target: target.id };

      setLocalSkills((prev) => {
        const result = [...prev];
        const fromIdx = result.findIndex((s) => s.id === sourceId);
        if (fromIdx === -1) return prev;
        const [card] = result.splice(fromIdx, 1);

        if (isSortable(target)) {
          const targetId = target.id as number;
          const targetGroup = target.group as SkillStatus;
          const movedCard =
            card.status !== targetGroup
              ? { ...card, status: targetGroup }
              : card;
          const insertAt = result.findIndex((s) => s.id === targetId);
          if (insertAt === -1) result.push(movedCard);
          else result.splice(insertAt, 0, movedCard);
        } else {
          // Empty column droppable
          const targetStatus = target.id as SkillStatus;
          result.push({ ...card, status: targetStatus });
        }

        return result;
      });
    },
  });

  const notStarted = localSkills.filter((s) => s.status === "not_started");
  const workingOn = localSkills.filter((s) => s.status === "working_on");
  const completed = localSkills.filter((s) => s.status === "completed");

  return (
    <div className="grid grid-cols-3 gap-4">
      <KanbanColumn
        skills={notStarted}
        status="not_started"
        recentlyDropped={recentlyDropped}
      />
      <KanbanColumn
        skills={workingOn}
        status="working_on"
        recentlyDropped={recentlyDropped}
      />
      <KanbanColumn
        skills={completed}
        status="completed"
        recentlyDropped={recentlyDropped}
      />
    </div>
  );
}

export function KanbanBoard({
  skills,
  track,
  level,
  onSkillStatusChange,
}: {
  skills: UserSkill[];
  track: string;
  level: number;
  onSkillStatusChange: (
    skillId: number,
    newStatus: SkillStatus,
  ) => Promise<boolean>;
}) {
  const [localSkills, setLocalSkills] = useState<UserSkill[]>(() =>
    loadOrder(skills, { track, level }),
  );
  const [draggingSkillId, setDraggingSkillId] = useState<number | null>(null);
  const [recentlyDropped, setRecentlyDropped] = useState<number | null>(null);

  // Snapshot before drag starts — used to revert on cancel
  const preDragRef = useRef<UserSkill[]>([]);
  // Always-current ref so handleDragEnd reads latest localSkills
  const localSkillsRef = useRef(localSkills);
  const recentlyDroppedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (recentlyDroppedTimerRef.current !== null) {
        clearTimeout(recentlyDroppedTimerRef.current);
      }
    };
  }, []);
  useEffect(() => {
    localSkillsRef.current = localSkills;
  }, [localSkills]);

  // Sync parent's data changes (rollbacks, new skills) while preserving local order
  const [prevSkills, setPrevSkills] = useState(skills);
  if (prevSkills !== skills) {
    setPrevSkills(skills);
    setLocalSkills((prev) => syncWithParent(prev, skills));
  }

  const handleDragStart: DragStartEvent = (event) => {
    preDragRef.current = localSkillsRef.current;
    setDraggingSkillId((event.operation.source?.id as number) ?? null);
  };

  const markRecentlyDropped = (skillId: number) => {
    if (recentlyDroppedTimerRef.current !== null) {
      clearTimeout(recentlyDroppedTimerRef.current);
    }
    setRecentlyDropped(skillId);
    recentlyDroppedTimerRef.current = setTimeout(
      () => setRecentlyDropped(null),
      500,
    );
  };

  const rollbackDrag = () => {
    const restoredSkills =
      preDragRef.current.length > 0
        ? preDragRef.current
        : localSkillsRef.current;

    localSkillsRef.current = restoredSkills;
    setLocalSkills(restoredSkills);

    if (recentlyDroppedTimerRef.current !== null) {
      clearTimeout(recentlyDroppedTimerRef.current);
      recentlyDroppedTimerRef.current = null;
    }
    setRecentlyDropped(null);
  };

  const handleDragEnd: DragEndEvent = async (event) => {
    setDraggingSkillId(null);

    if (!event.operation.source || !event.operation.target) {
      // Cancelled — revert to pre-drag order
      rollbackDrag();
      return;
    }

    const skillId = event.operation.source.id as number;
    // Use the server-confirmed status as "before", not the optimistic local state
    const originalStatus = skills.find((s) => s.id === skillId)?.status;
    if (!originalStatus) return;

    const finalStatus = isSortable(event.operation.target)
      ? (event.operation.target.group as SkillStatus)
      : (event.operation.target.id as SkillStatus);

    markRecentlyDropped(skillId);

    if (originalStatus !== finalStatus) {
      let didUpdate = false;
      try {
        didUpdate = await onSkillStatusChange(skillId, finalStatus);
      } catch {
        didUpdate = false;
      }
      if (!didUpdate) {
        rollbackDrag();
        return;
      }
    }

    saveOrder(localSkillsRef.current, { track, level });
  };

  const draggingSkill =
    draggingSkillId != null
      ? localSkills.find((s) => s.id === draggingSkillId)
      : null;

  return (
    <div className="flex flex-col gap-2">
      <DragDropProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <KanbanBoardContent
          localSkills={localSkills}
          setLocalSkills={setLocalSkills}
          recentlyDropped={recentlyDropped}
        />
        <DragOverlay dropAnimation={null}>
          {draggingSkill && <FloatingCard skill={draggingSkill} />}
        </DragOverlay>
      </DragDropProvider>
    </div>
  );
}
