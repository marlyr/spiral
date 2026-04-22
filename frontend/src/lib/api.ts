import axios from "axios";
import { supabase } from "./supabase";

const api = axios.create();

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const isAuthRoute = ["/login", "/register", "/forgot-password", "/reset-password"].includes(
      window.location.pathname,
    );

    if ((status === 401 || status === 403) && !isAuthRoute) {
      await supabase.auth.signOut();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
