import api from "@/lib/api";

import { Textarea } from "@/components/ui/textarea";
import { CategoryBadge } from "./category-badge";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  DialogTitle,
  DialogClose,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import type { UserSkill } from "@/types";
import { StatusBadge } from "@/components/status-badge";
import { useState, useEffect } from "react";

export function SkillDetailModal({ skill }: { skill: UserSkill }) {
  const [notes, setNotes] = useState(skill.notes ?? "");
  const [saved, setSaved] = useState(false);

  const handleSave = async (skill: UserSkill, newNotes: string) => {
    try {
      await api.patch(`/skills/${skill.id}`, { notes: newNotes });
      setSaved(true);
    } catch (error) {
      console.error("Failed to update skill notes: ", error);
      return;
    }
  };

  // TODO: save on close?

  useEffect(() => {
    const timerId = setTimeout(() => {
      handleSave(skill, notes);
    }, 1000); // autosave
    return () => clearTimeout(timerId);
  }, [notes, skill]);

  return (
    <DialogContent className="flex max-h-[min(640px,85vh)] flex-col gap-0 p-0 sm:max-w-md overflow-hidden">
      <DialogTitle asChild>
        <VisuallyHidden>{skill.name}</VisuallyHidden>
      </DialogTitle>
      <DialogDescription asChild>
        <div className="flex flex-col min-h-0 flex-1">
          {/* Card top — eyebrow, name, pills */}
          <div
            style={{
              padding: "20px 44px 16px 22px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--peri-dim)",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>{skill.track}</span>
              <span style={{ color: "var(--border-mid)" }}>·</span>
              <span>Level {skill.level}</span>
            </div>

            <div
              style={{
                fontSize: "22px",
                fontWeight: 600,
                color: "var(--foreground)",
                lineHeight: 1.2,
                marginBottom: "12px",
              }}
            >
              {skill.name}
            </div>

            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <CategoryBadge
                category={skill.category}
                style={{ fontSize: "11px", padding: "3px 9px" }}
              />
              <StatusBadge
                status={skill.status}
                style={{ fontSize: "11px", padding: "3px 9px" }}
              />
            </div>
          </div>

          {/* Card body — fields */}
          <div
            className="overflow-y-auto flex-1"
            style={{
              padding: "16px 22px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text3)",
                }}
              >
                My Notes
              </div>
              <Textarea
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setSaved(false);
                }}
                onBlur={() => handleSave(skill, notes)}
                maxLength={4000}
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore
                data-form-type="other"
                style={{
                  minHeight: "120px",
                  padding: "10px 12px",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "inherit",
                  fontSize: "13px",
                  color: "var(--text2)",
                  background: "var(--secondary)",
                  resize: "vertical",
                  lineHeight: 1.6,
                  outline: "none",
                  boxShadow: "none",
                }}
                placeholder="Add your own notes, cues, reminders…"
                id="notes"
              />
              <p
                style={{
                  textAlign: "right",
                  fontSize: "10px",
                  color: "var(--text3)",
                  position: "absolute",
                  bottom: "-16px",
                  right: "0",
                  margin: 0,
                  visibility: saved ? "visible" : "hidden",
                }}
              >
                Saved
              </p>
            </div>
          </div>
        </div>
      </DialogDescription>

      {/* Footer */}
      <div
        style={{
          padding: "12px 22px 18px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <DialogClose asChild>
          <Button className="w-22 text-[13px] bg-primary text-white border-none hover:bg-[#6670b8] transition-colors">
            Close
          </Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
}
