import { ChevronLeftIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CategoryBadge } from "./category-badge";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { UserSkill } from "@/types";
import { StatusBadge } from "@/components/status-badge";

export function SkillDetailModal({ skill }: { skill: UserSkill }) {
  return (
    <DialogContent className="flex max-h-[min(600px,80vh)] flex-col gap-0 p-0 sm:max-w-md">
      <DialogDescription asChild>
        <div className="p-6">
          <div className="[&_strong]:text-foreground space-y-4 [&_strong]:font-semibold">
            <p className="space-y-1 uppercase">
              {skill.track} • Level {skill.level}
            </p>
            <p className="text-base">
              <strong>{skill.name}</strong>
            </p>
            <div className="flex gap-2">
              <CategoryBadge
                category={skill.category}
                style={{ fontSize: "13px", padding: "4px 9px" }}
              />
              <StatusBadge
                status={skill.status}
                style={{ fontSize: "13px", padding: "4px 9px" }}
              />
            </div>
            <Separator className="my-3" />
            <div className="grid w-full gap-1.5">
              <Label className="mb-2">Notes</Label>
              <Textarea
                className="h-32"
                placeholder="Add your notes, cues, reminders..."
                id="message"
              />
            </div>
          </div>
        </div>
      </DialogDescription>
      <DialogFooter className="px-6 pb-6 sm:justify-start">
        <DialogClose asChild>
          <Button variant="outline">
            <ChevronLeftIcon />
            Back
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
