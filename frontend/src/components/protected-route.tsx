import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { getAuthenticatedRedirectPath } from "@/lib/auth-redirect";

function TrackRequiredRoute({ children }: { children: React.ReactNode }) {
  const [redirectPath, setRedirectPath] = useState<string | null>();

  useEffect(() => {
    let isMounted = true;

    getAuthenticatedRedirectPath()
      .then((path) => {
        if (isMounted) {
          setRedirectPath(path === "/track-selection" ? path : null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRedirectPath(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (redirectPath === undefined) return null;
  if (redirectPath) return <Navigate to={redirectPath} replace />;

  return <>{children}</>;
}

export function ProtectedRoute({
  children,
  requireTrack = false,
}: {
  children: React.ReactNode;
  requireTrack?: boolean;
}) {
  const { session, loading } = useAuth();

  if (loading) return null;
  if (!session) return <Navigate to="/login" replace />;
  if (requireTrack) {
    return (
      <TrackRequiredRoute key={session.user.id ?? session.access_token}>
        {children}
      </TrackRequiredRoute>
    );
  }

  return <>{children}</>;
}
