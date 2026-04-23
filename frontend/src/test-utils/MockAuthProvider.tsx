import type { Session, User } from "@supabase/supabase-js";
import { AuthContext, type AuthContextType } from "@/context/auth-context";

type MockAuthValue = Partial<AuthContextType> & {
  session?: Session | null;
  user?: User | null;
};

const defaultAuthValue: AuthContextType = {
  session: null,
  user: null,
  loading: false,
  signOut: async () => {},
};

export function MockAuthProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value?: MockAuthValue;
}) {
  return (
    <AuthContext.Provider value={{ ...defaultAuthValue, ...value }}>
      {children}
    </AuthContext.Provider>
  );
}
