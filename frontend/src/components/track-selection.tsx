import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/lib/api";
import { curriculumTracks } from "@/lib/track-details";
import { TrackCard } from "@/components/track-card";
import type { SkatingTrack } from "@/types";

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
    <div className="min-h-screen px-5 py-10 text-[var(--foreground)]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1080px] flex-col justify-center">
        <div className="max-w-[560px]">
          <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--peri-dim)]">
            Learn to Skate USA
          </p>
          <h1 className="text-[clamp(2.3rem,4vw,3.1rem)] leading-[1.08] font-extrabold tracking-[-0.03em]">
            Choose your track.
          </h1>
          <p className="mt-4 text-[1rem] leading-[1.7] text-[var(--text2)]">
            Pick the curriculum that matches your skating path. You can update
            it later if your focus changes.
          </p>
        </div>

        <div className="mt-10 grid auto-rows-fr grid-cols-2 gap-4 max-md:grid-cols-1">
          {curriculumTracks.map((track) => (
            <TrackCard
              key={track.track}
              track={track.track}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {generalError && (
          <p className="mt-5 text-sm text-red-500">
            Something went wrong, please try again
          </p>
        )}
      </div>
    </div>
  );
}
