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
import {
  CardStyle,
  LayoutDensity,
  LowDataMode,
  Toggle,
  useSettingsStore,
} from "@/store/settings";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, RefreshCcw } from "lucide-react";
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
  const { accent, density, style, set, adToggle, lowDataMode, saveHistory } =
    useSettingsStore();

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
          <aside className="w-64 py-4  flex flex-col justify-between">
            <div className="space-y-6">
              <h1 className="text-xl font-medium">Settings</h1>

              <nav className="flex flex-col">
                {[
                  {
                    label: "Appearance",
                    id: "appearance",
                  },

                  {
                    label: "Performance & Data",
                    id: "performance",
                  },

                  {
                    label: "Privacy & Control",
                    id: "privacy",
                  },
                  {
                    label: "Install",
                    id: "install",
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
            </div>
            <p className="text-sm font-medium text-muted-foreground">v.1.0.0</p>
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
                  <h1 className="text-lg">Install App</h1>
                  <p className="text-muted-foreground">
                    Install this app on your device for a better experience
                  </p>
                </header>

                <div className="grid place-items-center h-full ">
                  <InstallButton />

                  <div className="text-center space-y-2 max-w-md">
                    <p className="text-sm text-muted-foreground">
                      If the install button doesn’t work, try this:
                    </p>

                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Open in Chrome (Android / Desktop)</li>
                      <li>• Tap the browser menu (⋮)</li>
                      <li>• Select “Add to Home screen” or “Install app”</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {tab === "performance" && (
              <div>
                <header>
                  <h1 className="text-lg">Performance and Data</h1>
                  <p className="text-muted-foreground">
                    Control how the app uses data and system resources
                  </p>
                </header>

                <div className="divide-y mt-6">
                  <SettingRow
                    title="Advertisements"
                    description="Ads help support and keep the website running"
                  >
                    <Select
                      value={adToggle}
                      onValueChange={(v: Toggle) => set("adToggle", v)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="on">ON</SelectItem>
                          <SelectItem value="off">OFF</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </SettingRow>
                  <SettingRow
                    title="Data Saver"
                    description="Reduce data usage by lowering quality and disabling previews"
                  >
                    <Select
                      value={lowDataMode}
                      onValueChange={(v: LowDataMode) => set("lowDataMode", v)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="mid">Mid</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </SettingRow>
                </div>
              </div>
            )}

            {tab === "privacy" && (
              <div>
                <header>
                  <h1 className="text-lg">Privacy and Control</h1>
                  <p className="text-muted-foreground">
                    Manage your data, history, and tracking preferences
                  </p>
                </header>

                <div className="divide-y mt-6">
                  <SettingRow
                    title="Watch History"
                    description="Keep track of movies and shows you've watched"
                  >
                    <Select
                      value={saveHistory}
                      onValueChange={(v: Toggle) => set("saveHistory", v)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="on">ON</SelectItem>
                          <SelectItem value="off">OFF</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </SettingRow>
                  <SettingRow
                    title="Recommendations"
                    description="Use your watch history to suggest movies and shows"
                  >
                    <Select
                      value={saveHistory}
                      onValueChange={(v: Toggle) => set("saveHistory", v)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="on">ON</SelectItem>
                          <SelectItem value="off">OFF</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </SettingRow>
                  <SettingRow
                    title="Continue Watching"
                    description="Sync your watch progress across devices"
                  >
                    <Select
                      value={saveHistory}
                      onValueChange={(v: Toggle) => set("saveHistory", v)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="on">ON</SelectItem>
                          <SelectItem value="off">OFF</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </SettingRow>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h1 className="text-base">Clear History</h1>
                      <p className="text-muted-foreground"></p>
                    </div>
                    <Button variant="secondary">
                      Clear All <RefreshCcw />
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
