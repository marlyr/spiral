import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";

function Avatar({ email }: { email: string }) {
  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white bg-primary">
      {initial}
    </div>
  );
}

export function AvatarDropdown() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const email = user?.email ?? "";

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full p-0 hover:bg-transparent focus-visible:ring-0"
        >
          <Avatar email={email} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 rounded-xl border border-border bg-popover shadow-md p-1"
      >
        {/* User info header */}
        <div className="px-3 py-2.5">
          <p
            className="text-xs text-muted-foreground truncate mt-0.5"
            title={email}
          >
            {email}
          </p>
        </div>

        <DropdownMenuSeparator className="mx-1" />

        <DropdownMenuItem
          className="rounded-lg gap-2.5 px-3 py-2 text-sm text-foreground cursor-pointer"
          onClick={() => navigate("/track-selection")}
        >
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          Change track
        </DropdownMenuItem>

        <DropdownMenuSeparator className="mx-1" />

        <DropdownMenuItem
          variant="destructive"
          className="rounded-lg gap-2.5 px-3 py-2 text-sm cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOutIcon className="w-4 h-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
