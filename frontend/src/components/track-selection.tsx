import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SkatingTrack } from "@/types";
import api from "@/lib/api";
import { TrackCard } from "@/components/track-card";

const tracks = [
  { id: 1, name: "basic" as SkatingTrack },
  { id: 2, name: "adult" as SkatingTrack },
  { id: 3, name: "pre_freeskate" as SkatingTrack },
  { id: 4, name: "freeskate" as SkatingTrack },
];

export function TrackSelection() {
  const [generalError, setGeneralError] = useState(false);
  const navigate = useNavigate();

  async function handleSelect(track: SkatingTrack) {
    setGeneralError(false);
    try {
      await api.patch("/users/track", { active_track: track });
      navigate("/dashboard");
    } catch {
      setGeneralError(true);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <h1 className="text-4xl font-semibold tracking-tight">
        Choose your track
      </h1>
      <div className="flex flex-row gap-8">
        {tracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track.name}
            onSelect={handleSelect}
          />
        ))}
      </div>
      {generalError && (
        <p className="text-red-500 text-sm">
          Something went wrong, please try again
        </p>
      )}
    </div>
  );
}
