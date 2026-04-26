import { trackDetailsByTrack } from "@/lib/track-details";
import { cn } from "@/lib/utils";
import type { SkatingTrack } from "@/types";

export function TrackCard({
  track,
  onSelect,
  disabled = false,
  selected = false,
}: {
  track: SkatingTrack;
  onSelect: (track: SkatingTrack) => void;
  disabled?: boolean;
  selected?: boolean;
}) {
  const details = trackDetailsByTrack[track];
  const Icon = details.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(track)}
      disabled={disabled}
      className={cn(
        "group flex h-full w-full flex-col rounded-[16px] border bg-[var(--card)] p-6 text-left shadow-[0_8px_28px_rgba(26,23,20,0.08)] transition-[transform,box-shadow,border-color,opacity] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page-bg-color)]",
        selected
          ? "border-[var(--primary)] shadow-[0_18px_44px_rgba(26,23,20,0.12)] -translate-y-1 pointer-events-none"
          : disabled
            ? "border-[var(--border)] opacity-40 pointer-events-none"
            : "border-[var(--border)] hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-[0_18px_44px_rgba(26,23,20,0.12)]",
      )}
    >
      <div
        className={cn(
          "mb-4 grid size-10 place-items-center rounded-[10px]",
          details.iconClassName,
        )}
      >
        <Icon className="size-5" strokeWidth={2} />
      </div>

      <div className="text-[1.02rem] font-semibold tracking-[-0.01em] text-[var(--foreground)]">
        {details.title}
      </div>
      <p className="mt-2 text-[0.9rem] leading-[1.6] text-[var(--text2)]">
        {details.description}
      </p>
    </button>
  );
}
