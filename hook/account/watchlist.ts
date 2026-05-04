import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export type WatchlistItem = {
  id: string;
  watch_profile_id: string;
  tmdb_id: string;
  media_type: string;
  title: string;
  released_date: string | null;
  main_genre: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  added_at: string;
};

export type AddToWatchlistPayload = {
  tmdb_id: string;
  media_type: string;
  title: string;
  released_date?: string | null;
  main_genre?: string | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
};

export function useWatchlist() {
  const { data: session } = useSession();
  const profileId = session?.user?.activeProfileId;

  return useQuery({
    queryKey: ["watchlist", profileId],
    queryFn: async () => {
      const res = await fetch("/api/watchlist");
      if (!res.ok) throw new Error("Failed to fetch watchlist");
      return res.json() as Promise<WatchlistItem[]>;
    },
    enabled: !!profileId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAddToWatchlist() {
  const { data: session } = useSession();
  const profileId = session?.user?.activeProfileId;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddToWatchlistPayload) => {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to add to watchlist");
      }
    },
    onSuccess: (_, variables) => {
      toast.success("Added to watchlist", {
        description: variables.title,
      });
      queryClient.invalidateQueries({ queryKey: ["watchlist", profileId] });
    },
    onError: (error: Error) => {
      toast.error("Failed to add", {
        description: error.message,
      });
    },
  });
}

export function useRemoveFromWatchlist() {
  const { data: session } = useSession();
  const profileId = session?.user?.activeProfileId;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tmdb_id,
      media_type,
    }: {
      tmdb_id: string;
      media_type: string;
    }) => {
      const res = await fetch("/api/watchlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tmdb_id, media_type }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to remove from watchlist");
      }
    },
    onSuccess: () => {
      toast.success("Removed from watchlist");
      queryClient.invalidateQueries({ queryKey: ["watchlist", profileId] });
    },
    onError: (error: Error) => {
      toast.error("Failed to remove", {
        description: error.message,
      });
    },
  });
}
