"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ThemeModeToggle } from "@/components/ui/theme";
import { CardStyle, LayoutDensity, useSettingsStore } from "@/store/settings";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import InstallButton from "@/components/ui/install";

/* Tailwind-safe colors */
const ACCENT_CLASSES = {
  red: "bg-red-600",
  blue: "bg-blue-600",
  green: "bg-green-600",
  purple: "bg-purple-600",
  orange: "bg-orange-500",
};

export default function SettingsPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState("appearance");
  const { accent, density, style, set } = useSettingsStore();

  const handleClose = (value: boolean) => {
    setOpen(value);
    if (!value) setTimeout(() => router.back(), 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100%-20px)] lg:w-fit p-4">
        <DialogHeader className="sr-only">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your movie experience</DialogDescription>
        </DialogHeader>

        <div className="flex w-4xl">
          {/* Sidebar */}
          <aside className="w-64 py-4 space-y-6">
            <h1 className="text-xl font-medium">Settings</h1>

            <nav className="flex flex-col">
              {[
                {
                  label: "Appearance",
                  id: "appearance",
                },
                {
                  label: "Install",
                  id: "install",
                },
                {
                  label: "Performance & Data",
                  id: "performance",
                },
                {
                  label: "Cache Settings",
                  id: "cache",
                },
              ].map((item, i) => (
                <span
                  key={item.id}
                  className={cn(
                    "px-4 py-3 border-l cursor-pointer",
                    tab === item.id ? "border-red-600" : "",
                  )}
                  onClick={() => setTab(item.id)}
                >
                  {item.label}
                </span>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <section className="flex-1 bg-background rounded-md p-4 space-y-6 h-120">
            {tab === "appearance" && (
              <div>
                <header>
                  <h1 className="text-lg">Appearance</h1>
                  <p className="text-muted-foreground">
                    Customize how the app looks and feels
                  </p>
                </header>

                <div className="divide-y">
                  {/* Theme */}
                  <SettingRow title="Theme" description="Light or dark mode">
                    <ThemeModeToggle />
                  </SettingRow>

                  {/* Accent */}
                  <SettingRow
                    title="Accent Color"
                    description="Highlights and buttons"
                  >
                    <div className="flex gap-2">
                      {(
                        Object.keys(ACCENT_CLASSES) as Array<
                          keyof typeof ACCENT_CLASSES
                        >
                      ).map((color) => (
                        <button
                          key={color}
                          onClick={() => set("accent", color)}
                          className={`size-8 rounded-full ${
                            ACCENT_CLASSES[color]
                          } ${
                            accent === color
                              ? "ring-2 ring-offset-2 ring-black dark:ring-white"
                              : ""
                          }`}
                        />
                      ))}
                    </div>
                  </SettingRow>

                  {/* Layout Density */}
                  <SettingRow
                    title="Layout Density"
                    description="Spacing and compactness"
                  >
                    <Select
                      value={density}
                      onValueChange={(v: LayoutDensity) => set("density", v)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="comfortable">
                            Comfortable
                          </SelectItem>
                          <SelectItem value="spacious">Spacious</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </SettingRow>

                  {/* Card Style */}
                  <SettingRow
                    title="Card Style"
                    description="Visual style of cards"
                  >
                    <Select
                      value={style}
                      onValueChange={(v: CardStyle) => set("style", v)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="only">Poster Only</SelectItem>
                          <SelectItem value="title">Title</SelectItem>
                          <SelectItem value="title-year">
                            Title + Year
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </SettingRow>
                </div>
              </div>
            )}
            {tab === "install" && (
              <div className="h-full">
                <header>
                  <h1 className="text-lg">Install Progressive Web App</h1>
                  <p className="text-muted-foreground">Download the app</p>
                </header>
                <div className="flex justify-center items-center h-full">
                  <InstallButton />1
                </div>
              </div>
            )}

            {tab === "performance" && <>soon</>}
            {tab === "cache" && <>soon</>}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* Reusable row */
function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <h1 className="text-base">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
