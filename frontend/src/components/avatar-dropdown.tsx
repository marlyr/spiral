import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, SlidersHorizontal } from "lucide-react";

// TODO: replace with real auth data
const name = "Me";
const email = "me@example.com";

function Avatar() {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white bg-primary">
      {initial}
    </div>
  );
}

export function AvatarDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full p-0 hover:bg-transparent focus-visible:ring-0"
        >
          <Avatar />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 rounded-xl border border-border bg-popover shadow-md p-1"
      >
        {/* User info header */}
        <div className="px-3 py-2.5">
          <p className="text-sm font-medium text-foreground">{name}</p>
          <p
            className="text-xs text-muted-foreground truncate mt-0.5"
            title={email}
          >
            {email}
          </p>
        </div>

        <DropdownMenuSeparator className="mx-1" />

        <DropdownMenuItem className="rounded-lg gap-2.5 px-3 py-2 text-sm text-foreground cursor-pointer">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          Change track
        </DropdownMenuItem>

        <DropdownMenuSeparator className="mx-1" />

        <DropdownMenuItem
          variant="destructive"
          className="rounded-lg gap-2.5 px-3 py-2 text-sm cursor-pointer"
        >
          <LogOutIcon className="w-4 h-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
