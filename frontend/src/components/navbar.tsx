import { House, BookText } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarDropdown } from "@/components/avatar-dropdown";

const tabs = [
  {
    name: "Home",
    value: "home",
    icon: House,
  },
  {
    name: "Diary",
    value: "diary",
    icon: BookText,
  },
];

export function Navbar() {
  return (
    <div className="flex items-center gap-3">
      <Tabs defaultValue="explore" className="gap-4">
        <TabsList className="bg-transparent border border-border rounded-full p-1">
          {tabs.map(({ icon: Icon, name, value }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="rounded-full px-3 py-1 text-sm text-muted-foreground hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none"
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
