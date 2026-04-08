import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import api from "@/lib/api";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_IN") {
        const { data } = await api.get("/users/profile");
        if (data.active_track) {
          navigate("/dashboard");
        } else {
          navigate("/track-selection");
        }
      } else if (event === "PASSWORD_RECOVERY") {
        navigate("/reset-password");
      }
    });
  }, [navigate]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <p className="text-sm text-muted-foreground">Signing you in...</p>
    </div>
  );
}
