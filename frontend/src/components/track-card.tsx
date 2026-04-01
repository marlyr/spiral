import type { SkatingTrack } from "@/types";

export function TrackCard({
  image,
  track,
  onSelect,
}: {
  image: any;
  track: SkatingTrack;
  onSelect: (track: SkatingTrack) => void;
}) {
  return (
    <div onClick={() => onSelect(track)} className="flex flex-col items-center">
      <img
        src={image}
        alt={track}
        className="h-64 w-48 object-contain cursor-pointer rounded-lg transition-transform hover:scale-105"
      />
      <p className="text-lg -mt-8">{track}</p>
    </div>
  );
}
