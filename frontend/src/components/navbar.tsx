import { BookText, House } from "lucide-react";
import { useLocation } from "react-router-dom";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarDropdown } from "@/components/avatar-dropdown";

const tabs = [
  {
    name: "Home",
    value: "home",
    icon: House,
    disabled: false,
  },
  {
    name: "Diary",
    value: "diary",
    icon: BookText,
    disabled: true,
  },
];

export function Navbar() {
  const { pathname } = useLocation();
  const activeTab = pathname === "/dashboard" ? "home" : "";

  return (
    <div className="flex items-center gap-3">
      <Tabs value={activeTab} className="gap-4">
        <TabsList className="bg-card border border-border rounded-full p-1">
          {tabs.map(({ icon: Icon, name, value, disabled }) => (
            <TabsTrigger
              key={value}
              value={value}
              disabled={disabled}
              className="rounded-full px-3 py-1 text-sm text-muted-foreground hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Icon />
              {name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <AvatarDropdown />
    </div>
  );
}
