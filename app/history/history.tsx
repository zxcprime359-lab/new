"use client";
import TitleReusable from "@/components/ui/title";
import { HistoryIcon } from "@/components/icon/history";
import { useWatchHistory } from "@/hook/account/history";
import HistoryCard from "./history-card";
import { Tabs } from "@/components/ui/vercel";
import { useState } from "react";
import Footer from "@/components/ui/footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { Button } from "@/components/ui/button";
import { Trash, X } from "lucide-react";
import { IconGhost2Filled } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function History() {
  const [tab, setTab] = useState("all");
  const [isDelete, setIsDelete] = useState(false);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useWatchHistory();

  const history = data?.pages.flatMap((p) => p.items);

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

  const filteredCompleted = filterByTab(history);

  return (
    <div className=" lg:pl-35 pl-2 lg:pr-8 pr-2 ">
      <div className="fixed bottom-8 right-8">
        <Button
          variant="destructive"
          size="xl"
          onClick={() => setIsDelete((prev) => !prev)}
        >
          {isDelete ? <X /> : <Trash />}
        </Button>
      </div>
      <div className="min-h-screen lg:mt-8 mt-4">
        <TitleReusable
          title="History"
          Icon={HistoryIcon}
          description="See what you've watched recently and continue where you left off."
        />

        <div className="mt-12 flex justify-between items-center">
          <Tabs tabs={tabs} onTabChange={(tabId) => setTab(tabId)} />
        </div>

        <div className="mt-6">
          <div className="grid grid-cols-5 gap-1.5">
            {isLoading || history === undefined ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2 p-0.5">
                  <Skeleton className="aspect-video w-full" />
                  <Skeleton className="h-3.5 w-40 mx-auto" />
                  <Skeleton className="h-2.5 w-20 mx-auto" />
                </div>
              ))
            ) : filteredCompleted.length === 0 ? (
              <div className="col-span-5 h-100 flex items-center justify-center text-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <div className="p-2 animate-bounce">
                    <IconGhost2Filled className="lg:size-8 size-7" />
                  </div>

                  <h1 className="lg:text-2xl text-lg font-semibold text-foreground">
                    Nothing to show here yet
                  </h1>

                  <p className="text-sm">
                    Start watching movies or shows and we’ll track your history
                  </p>
                </div>
              </div>
            ) : (
              filteredCompleted.map((m) => (
                <HistoryCard
                  isDelete={isDelete}
                  key={m.id}
                  m={m}
                  poster={false}
                />
              ))
            )}
          </div>
          {hasNextPage && (
            <div className="flex justify-center items-center p-4">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="secondary"
                size="xl"
              >
                {isFetchingNextPage ? "Loading..." : "Load more"}
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
