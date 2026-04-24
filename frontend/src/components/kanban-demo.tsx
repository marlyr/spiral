import { useEffect, useRef, useState } from "react";
import { CategoryBadge } from "@/components/category-badge";
import { statusStyles } from "@/lib/status-styles";
import type { SkillCategory, SkillStatus } from "@/types";

const STATIC_SKILLS: {
  id: number;
  name: string;
  status: SkillStatus;
  category: SkillCategory;
}[] = [
  { id: 1, name: "Waltz jump", status: "not_started", category: "jump" },
  { id: 2, name: "T-stop", status: "not_started", category: "foundation" },
  {
    id: 3,
    name: "Forward crossovers",
    status: "completed",
    category: "footwork",
  },
];

const ANIMATED_SKILL: {
  id: number;
  name: string;
  status: SkillStatus;
  category: SkillCategory;
} = {
  id: 4,
  name: "Two-foot spin",
  status: "working_on",
  category: "spin",
};

function CursorSVG({ grabbing }: { grabbing: boolean }) {
  return (
    <svg
      width="13"
      height="16"
      viewBox="0 0 16 20"
      style={{
        display: "block",
        filter: "drop-shadow(0 2px 4px rgba(90,99,168,0.45))",
        transform: grabbing ? "scale(0.88)" : "scale(1)",
        transition: "transform 120ms ease",
      }}
    >
      <path
        d="M2 1 L2 15.5 L5.5 12 L8 18 L9.5 17.3 L7 11.5 L12.5 11.5 Z"
        fill={grabbing ? "#5a63a8" : "#7c85c8"}
        stroke="rgba(20,18,15,0.55)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        style={{ transition: "fill 120ms ease" }}
      />
    </svg>
  );
}

function DemoCard({
  name,
  category,
  highlighted = false,
  ghost = false,
  entering = false,
}: {
  name: string;
  category: SkillCategory;
  highlighted?: boolean;
  ghost?: boolean;
  entering?: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-1 bg-background rounded-lg px-3 py-[10px]"
      style={{
        border: ghost
          ? "1.5px dashed var(--border)"
          : highlighted
            ? "1px solid var(--primary)"
            : "1px solid var(--border)",
        boxShadow: highlighted ? "0 0 0 2px var(--accent)" : undefined,
        opacity: ghost ? 0.3 : 1,
        transform: entering
          ? "scale(0.9) translateY(4px)"
          : "scale(1) translateY(0)",
        transition:
          "opacity 220ms ease, transform 350ms cubic-bezier(0.34,1.56,0.64,1), border-color 150ms ease, box-shadow 150ms ease",
      }}
    >
      <p
        className="text-[13px] font-medium text-foreground"
        style={{ visibility: ghost ? "hidden" : "visible" }}
      >
        {name}
      </p>
      <div style={{ visibility: ghost ? "hidden" : "visible" }}>
        <CategoryBadge category={category} />
      </div>
    </div>
  );
}

function DemoColumn({
  status,
  count,
  children,
}: {
  status: SkillStatus;
  count: number;
  children?: React.ReactNode;
}) {
  const { label, color, dotColor } = statusStyles[status];
  return (
    <div
      className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3"
      style={{ borderTopWidth: "2px", borderTopColor: color }}
    >
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span
            className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${dotColor}`}
          />
          <span
            className="text-[11px] font-medium tracking-widest uppercase"
            style={{ color: "var(--peri-dim)" }}
          >
            {label}
          </span>
        </div>
        <span className="text-[11px]" style={{ color: "var(--border-mid)" }}>
          {count}
        </span>
      </div>
      <div className="flex flex-col gap-2" style={{ minHeight: "144px" }}>
        {children}
      </div>
    </div>
  );
}

export function KanbanDemo() {
  const boardRef = useRef<HTMLDivElement>(null);

  const [cursorX, setCursorX] = useState(0);
  const [cursorY, setCursorY] = useState(0);
  const [cursorTrans, setCursorTrans] = useState("none");
  const [grabbing, setGrabbing] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);

  const [cardHighlighted, setCardHighlighted] = useState(false);
  const [cardGhost, setCardGhost] = useState(false);
  const [cardInCompleted, setCardInCompleted] = useState(false);
  const [destEntering, setDestEntering] = useState(false);

  const [floatVisible, setFloatVisible] = useState(false);
  const [floatX, setFloatX] = useState(0);
  const [floatY, setFloatY] = useState(0);
  const [floatTrans, setFloatTrans] = useState("none");
  const [floatRotate, setFloatRotate] = useState(0);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let active = true;

    function s(ms: number, fn: () => void) {
      const id = setTimeout(() => {
        if (active) fn();
      }, ms);
      timers.push(id);
    }

    function runCycle() {
      if (!active || !board) return;

      const { width: W, height: H } = board.getBoundingClientRect();
      if (W < 10) {
        s(5000, runCycle);
        return;
      }

      const gap = 12;
      const colW = (W - 2 * gap) / 3;

      const srcX = colW + gap + colW / 2;
      const srcY = 16 + 52 + 29;

      const dstX = 2 * (colW + gap) + colW / 2;
      const dstY = 16 + 52 + 58 + 8 + 29;

      const restX = W * 0.88;
      const restY = H * 0.88;

      const swingX = srcX + (restX - srcX) * 0.45;
      const swingY = srcY + (restY - srcY) * 0.3;

      const arcX = srcX + (dstX - srcX) * 0.3;
      const arcY = Math.min(srcY, dstY) - 22;

      function fp(cx: number, cy: number) {
        return { x: cx - colW / 2, y: cy - 14 };
      }

      setCursorVisible(true);
      setCursorTrans("none");
      setCursorX(restX);
      setCursorY(restY);
      setGrabbing(false);
      setCardHighlighted(false);
      setCardGhost(false);
      setCardInCompleted(false);
      setDestEntering(false);
      setFloatVisible(false);
      setFloatRotate(0);

      let t = 0;

      t += 1200;

      s(t, () => {
        setCursorTrans("transform 420ms cubic-bezier(0.4,0,0.6,1)");
        setCursorX(swingX);
        setCursorY(swingY);
      });
      t += 420;

      s(t, () => {
        setCursorTrans("transform 560ms cubic-bezier(0.1,0,0.1,1)");
        setCursorX(srcX);
        setCursorY(srcY);
        setCardHighlighted(true);
      });
      t += 560;

      s(t, () => {
        setCursorTrans("transform 80ms ease");
        setCursorX(srcX + 1);
        setCursorY(srcY);
      });
      t += 80;

      s(t, () => {
        setCursorTrans("transform 130ms ease");
        setCursorX(srcX);
        setCursorY(srcY);
      });
      t += 270;

      s(t, () => {
        setGrabbing(true);
        setCardHighlighted(false);
        setCardGhost(true);
        const { x, y } = fp(srcX, srcY);
        setFloatX(x);
        setFloatY(y);
        setFloatTrans("none");
        setFloatVisible(true);
        setFloatRotate(0);
      });
      t += 250;

      s(t, () => {
        setCursorTrans("transform 280ms cubic-bezier(0.4,0,0.6,0.9)");
        setCursorX(arcX);
        setCursorY(arcY);
        const { x, y } = fp(arcX, arcY);
        setFloatTrans("transform 280ms cubic-bezier(0.4,0,0.6,0.9)");
        setFloatX(x);
        setFloatY(y);
        setFloatRotate(3);
      });
      t += 280;

      s(t, () => {
        setCursorTrans("transform 700ms cubic-bezier(0.1,0,0.2,1)");
        setCursorX(dstX);
        setCursorY(dstY);
        const { x, y } = fp(dstX, dstY);
        setFloatTrans("transform 700ms cubic-bezier(0.1,0,0.2,1)");
        setFloatX(x);
        setFloatY(y);
      });
      t += 700;

      s(t, () => {
        setGrabbing(false);
        setFloatVisible(false);
        setCardGhost(false);
        setCardInCompleted(true);
        setDestEntering(true);
        setFloatRotate(0);
      });
      t += 60;

      s(t, () => {
        setDestEntering(false);
      });
      t += 400;

      s(t, () => {
        setCursorTrans("transform 600ms cubic-bezier(0.4,0,0.2,1)");
        setCursorX(W + 20);
        setCursorY(H * 0.5);
      });
      t += 600;

      s(t, () => {
        setCursorVisible(false);
      });
      t += 600;

      s(t, runCycle);
    }

    runCycle();

    return () => {
      active = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  const staticNS = STATIC_SKILLS.filter((s) => s.status === "not_started");
  const staticComp = STATIC_SKILLS.filter((s) => s.status === "completed");

  return (
    <div
      ref={boardRef}
      className="grid grid-cols-3 gap-3 relative"
      style={{ overflow: "visible" }}
    >
      <DemoColumn status="not_started" count={staticNS.length}>
        {staticNS.map((s) => (
          <DemoCard key={s.id} name={s.name} category={s.category} />
        ))}
      </DemoColumn>

      <DemoColumn status="working_on" count={cardInCompleted ? 0 : 1}>
        {/* Always in DOM so the column never shrinks */}
        <div
          style={{
            opacity: cardInCompleted ? 0 : 1,
            transition: "opacity 200ms ease",
          }}
        >
          <DemoCard
            name={ANIMATED_SKILL.name}
            category={ANIMATED_SKILL.category}
            highlighted={cardHighlighted}
            ghost={cardGhost || cardInCompleted}
          />
        </div>
      </DemoColumn>

      <DemoColumn
        status="completed"
        count={staticComp.length + (cardInCompleted ? 1 : 0)}
      >
        {staticComp.map((s) => (
          <DemoCard key={s.id} name={s.name} category={s.category} />
        ))}
        {/* Always in DOM so the column never grows */}
        <div
          style={{
            opacity: cardInCompleted ? 1 : 0,
            transition: "opacity 220ms ease",
          }}
        >
          <DemoCard
            name={ANIMATED_SKILL.name}
            category={ANIMATED_SKILL.category}
            entering={destEntering}
          />
        </div>
      </DemoColumn>

      {floatVisible && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "calc((100% - 24px) / 3)",
            pointerEvents: "none",
            zIndex: 10,
            transform: `translate(${floatX}px, ${floatY}px) rotate(${floatRotate}deg) scale(1.04)`,
            transition: floatTrans,
            boxShadow: "0 10px 28px rgba(0,0,0,0.16), 0 0 0 2px var(--primary)",
            borderRadius: "8px",
          }}
        >
          <DemoCard
            name={ANIMATED_SKILL.name}
            category={ANIMATED_SKILL.category}
          />
        </div>
      )}

      {cursorVisible && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: `translate(${cursorX}px, ${cursorY}px)`,
            transition: cursorTrans,
            pointerEvents: "none",
            zIndex: 20,
          }}
        >
          <CursorSVG grabbing={grabbing} />
        </div>
      )}
    </div>
  );
}
