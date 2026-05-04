import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export type ContinueWatchingItem = {
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
  progress_seconds: number;
  duration_seconds: number | null;
  last_watched_at: string;
};

export type UpsertContinueWatchingPayload = {
  tmdb_id: string;
  media_type: string;
  title: string;
  progress_seconds: number;
  season?: number;
  episode?: number;
  released_date?: string | null;
  main_genre?: string | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
  duration_seconds?: number | null;
};

export type RemoveContinueWatchingPayload = {
  tmdb_id: string;
  media_type: string;
  season?: number;
  episode?: number;
};

export type FinishWatchingPayload = {
  tmdb_id: string;
  media_type: string;
  title: string;
  watched_seconds: number;
  duration_seconds: number;
  season?: number;
  episode?: number;
  released_date?: string | null;
  main_genre?: string | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
};
export type ContinueWatchingResponse = {
  active: ContinueWatchingItem[];
  dropped: ContinueWatchingItem[];
};
export function useContinueWatching() {
  const { data: session } = useSession();
  const profileId = session?.user?.activeProfileId;

  return useQuery({
    queryKey: ["progress-save", profileId],
    queryFn: async () => {
      const res = await fetch("/api/progress-save");
      if (!res.ok) throw new Error("Failed to fetch continue watching");
      return res.json() as Promise<ContinueWatchingResponse>;
    },
    enabled: !!profileId,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpsertContinueWatching() {
  const { data: session } = useSession();
  const profileId = session?.user?.activeProfileId;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpsertContinueWatchingPayload) => {
      const res = await fetch("/api/progress-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to update progress");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["progress-save", profileId],
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to save progress", {
        description: error.message,
      });
    },
  });
}

export function useRemoveFromContinueWatching() {
  const { data: session } = useSession();
  const profileId = session?.user?.activeProfileId;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RemoveContinueWatchingPayload) => {
      const res = await fetch("/api/progress-save", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.error ?? "Failed to remove from continue watching",
        );
      }
    },
    onSuccess: () => {
      toast.success("Removed from continue watching");
      queryClient.invalidateQueries({
        queryKey: ["progress-save", profileId],
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to remove", {
        description: error.message,
      });
    },
  });
}

export function useFinishWatching() {
  const { data: session } = useSession();
  const profileId = session?.user?.activeProfileId;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: FinishWatchingPayload) => {
      const res = await fetch("/api/progress-save", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, finished: true }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to finish watching");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["progress-save", profileId],
      });
      queryClient.invalidateQueries({
        queryKey: ["watch-history", profileId],
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to save watch history", {
        description: error.message,
      });
    },
  });
}
