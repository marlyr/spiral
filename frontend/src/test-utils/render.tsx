import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { AuthContextType } from "@/context/auth-context";
import { MockAuthProvider } from "./MockAuthProvider";

export function renderWithProviders(
  ui: React.ReactNode,
  {
    route = "/",
    authValue,
  }: {
    route?: string;
    authValue?: Partial<AuthContextType>;
  } = {},
) {
  window.history.replaceState({}, "", route);

  return render(
    <MemoryRouter initialEntries={[route]}>
      <MockAuthProvider value={authValue}>{ui}</MockAuthProvider>
    </MemoryRouter>,
  );
}
