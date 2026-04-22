import type { SkatingTrack } from "@/types";

export function TrackCard({
  track,
  onSelect,
}: {
  track: SkatingTrack;
  onSelect: (track: SkatingTrack) => void;
}) {
  return (
    <div onClick={() => onSelect(track)} className="flex flex-col items-center">
      <div className="flex h-64 w-48 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 text-lg font-semibold capitalize text-slate-600 transition-transform hover:scale-105">
        {track.replace("_", " ")}
      </div>
      <p className="text-[15px] font-medium text-foreground -mt-8">{track}</p>
    </div>
  );
}
