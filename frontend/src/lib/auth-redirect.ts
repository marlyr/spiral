import api from "@/lib/api";
import type { User } from "@/types";

export async function getAuthenticatedRedirectPath() {
  const { data } = await api.get<User>("/users/profile");

  return data.active_track ? "/dashboard" : "/track-selection";
}
