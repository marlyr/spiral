import { useState } from "react";
import { useNavigate } from "react-router-dom";
import placeholder from "@/assets/placeholder.png";
import type { SkatingTrack } from "@/types";
import api from "@/lib/api";
import { TrackCard } from "@/components/track-card";

const tracks = [
  { id: 1, name: "basic" as SkatingTrack, image: placeholder },
  { id: 2, name: "adult" as SkatingTrack, image: placeholder },
  { id: 3, name: "pre_freeskate" as SkatingTrack, image: placeholder },
  { id: 4, name: "freeskate" as SkatingTrack, image: placeholder },
];

export function TrackSelection() {
  const [generalError, setGeneralError] = useState(false);
  const navigate = useNavigate();

  async function handleSelect(track: SkatingTrack) {
    setGeneralError(false);
    console.log(track);
    try {
      await api.patch("/users/track", { active_track: track });
      navigate("/dashboard");
    } catch (error: any) {
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
            image={track.image}
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
