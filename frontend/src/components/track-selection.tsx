import { useState } from 'react'
import placeholder from '@/assets/placeholder.png';
import type { SkatingTrack } from "@/types";
import axios from 'axios'


function TrackCard({ image, track, onSelect }: { image: any, track: SkatingTrack, onSelect: (track: SkatingTrack) => void }) {
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

const tracks = [
  { id: 1, name: "basic" as SkatingTrack, image: placeholder },
  { id: 2, name: "adult" as SkatingTrack, image: placeholder },
  { id: 3, name: "pre_freeskate" as SkatingTrack, image: placeholder },
  { id: 4, name: "freeskate" as SkatingTrack, image: placeholder },
];

export function TrackSelection() {
  const [generalError, setGeneralError] = useState(false)

  async function handleSelect(track: SkatingTrack) {
    setGeneralError(false);
    console.log(track);
    try {
      const token = localStorage.getItem('jwtToken')
      await axios.patch('/users/track', { active_track: track }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate('/dashboard')
    } catch (error: any) {
      setGeneralError(true);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <h1 className="text-5xl font-bold">Choose your track</h1>
      <div className="flex flex-row gap-8">
        {tracks.map(track => (
          <TrackCard key={track.id} image={track.image} track={track.name} onSelect={handleSelect} />
        ))}
      </div>
      {generalError && <p className="text-red-500 text-sm">Something went wrong, please try again</p>}
    </div>
  );
}

