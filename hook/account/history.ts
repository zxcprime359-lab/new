import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export type WatchHistoryItem = {
  id: string;
  watch_profile_id: string;
  tmdb_id: string;
  media_type: string;
  season: number;
  episode: number;
  title: string;
  released_date: string | null;
  main_genre: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  watched_seconds: number;
  duration_seconds: number;
  watched_at: string;
};

export type WatchHistoryPage = {
  items: WatchHistoryItem[];
  nextCursor: string | null;
};

export function useWatchHistory() {
  const { data: session } = useSession();
  const profileId = session?.user?.activeProfileId;

  return useInfiniteQuery({
    queryKey: ["watch-history", profileId],
    queryFn: async ({ pageParam }: { pageParam: string | null }) => {
      const params = new URLSearchParams({ limit: "20" });
      if (pageParam) params.set("cursor", pageParam);
      const res = await fetch(`/api/history?${params}`);
      if (!res.ok) throw new Error("Failed to fetch watch history");
      return res.json() as Promise<WatchHistoryPage>;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!profileId,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useRemoveFromWatchHistory() {
  const { data: session } = useSession();
  const profileId = session?.user?.activeProfileId;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tmdb_id,
      media_type,
      season,
      episode,
    }: {
      tmdb_id: string;
      media_type: string;
      season?: number;
      episode?: number;
    }) => {
      const res = await fetch("/api/history", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tmdb_id, media_type, season, episode }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to remove from watch history");
      }
    },
    onSuccess: () => {
      toast.success("Removed from history");
      queryClient.invalidateQueries({ queryKey: ["watch-history", profileId] });
    },
    onError: (error: Error) => {
      toast.error("Failed to remove", {
        description: error.message,
      });
    },
  });
}
