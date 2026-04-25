import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { getAuthenticatedRedirectPath } from "@/lib/auth-redirect";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const isPasswordRecoveryRedirect =
      new URLSearchParams(window.location.search).get("type") === "recovery" ||
      new URLSearchParams(window.location.hash.replace(/^#/, "")).get(
        "type",
      ) === "recovery";

    async function sendAuthenticatedUserHome() {
      try {
        const path = await getAuthenticatedRedirectPath();
        if (isMounted) {
          navigate(path, { replace: true });
        }
      } catch {
        if (isMounted) {
          setError("We couldn't finish signing you in. Please try logging in.");
        }
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        if (session) {
          setTimeout(() => {
            void sendAuthenticatedUserHome();
          }, 0);
        }
      } else if (event === "PASSWORD_RECOVERY") {
        navigate("/reset-password", { replace: true });
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !isPasswordRecoveryRedirect) {
        void sendAuthenticatedUserHome();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <p className="text-sm text-muted-foreground">
        {error || "Signing you in..."}
      </p>
    </div>
  );
}
