import { House, BookText, User } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  {
    name: "Profile",
    value: "profile",
    icon: User,
  },
];

export function Navbar() {
  return (
    <div className="flex items-center justify-center w-full max-w-md">
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
    </div>
  );
}
