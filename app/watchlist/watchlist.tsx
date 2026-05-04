"use client";
import { useWatchlist } from "@/hook/account/watchlist";
import { Bookmark } from "lucide-react";
import TitleReusable from "@/components/ui/title";
import Footer from "@/components/ui/footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { Tabs } from "@/components/ui/vercel";
import { useState } from "react";
import WatchlistCard from "./watchlist-card";
import { Skeleton } from "@/components/ui/skeleton";
import { IconGhost2Filled } from "@tabler/icons-react";

export default function Watchlist() {
  const { data, isLoading } = useWatchlist();
  const [isDelete, setIsDelete] = useState(false);

  const [tab, setTab] = useState("all");
  const tabs = [
    { id: "all", label: "All" },
    { id: "movie", label: "Movies" },
    { id: "tv", label: "TV Shows" },
    { id: "anime", label: "Anime" },
  ];

  const filterByTab = (list: any[] = []) => {
    if (tab === "all") return list;
    return list.filter((item) => item.media_type === tab);
  };

  const filteredCompleted = filterByTab(data);

  return (
    <div className=" pl-35 pr-8 ">
      <div className=" min-h-screen mt-8 ">
        <TitleReusable
          title="Watchlist"
          Icon={Bookmark}
          description="View and watch your recently saved watchlist."
        />
        <div className="mt-12 flex justify-between items-center">
          <Tabs tabs={tabs} onTabChange={(tabId) => setTab(tabId)} />
        </div>
        <div className="grid grid-cols-7 gap-1.5 mt-6">
          {isLoading || data === undefined ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2 p-0.5">
                <Skeleton className="aspect-2/3 w-full" />
              </div>
            ))
          ) : filteredCompleted.length === 0 ? (
            <div className="col-span-7 h-100 flex items-center justify-center text-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <div className="p-2 animate-bounce">
                  <IconGhost2Filled className="size-8" />
                </div>

                <h1 className="text-2xl font-semibold text-foreground">
                  Nothing to show here yet
                </h1>

                <p className="text-sm">
                  Start watching movies or shows and we’ll track your history
                </p>
              </div>
            </div>
          ) : (
            filteredCompleted.map((m, idx) => (
              <WatchlistCard key={m.id} m={m} idx={idx} />
            ))
          )}
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
