"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ProviderResponse } from "@/types/movie-by-id";

export default function useStreamProviders({
  media_type,
}: {
  media_type: string;
}) {
  const query = useQuery<ProviderResponse>({
    queryKey: ["get-providers", media_type],
    enabled: !!media_type,
    queryFn: async () => {
      const url = `https://api.themoviedb.org/3/watch/providers/${media_type}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&watch_region=PH`;
      try {
        const res = await axios.get(url);

        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}
