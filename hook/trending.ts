"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { MovieTypes } from "@/types/movie-by-id";

export interface TrendingTypes {
  media_type: "movie" | "tv" | "all";
  time_window: "day" | "week";
  page?: number;
}

interface TrendingResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: MovieTypes[];
}

export default function useGetTrending({
  media_type = "all",
  time_window = "week",
  page = 1,
}: TrendingTypes) {
  return useQuery<TrendingResponse>({
    queryKey: ["trending", media_type, time_window, page],

    queryFn: async () => {
      const res = await axios.get(
        `https://api.themoviedb.org/3/trending/${media_type}/${time_window}`,
        {
          params: {
            api_key: process.env.NEXT_PUBLIC_TMDB_KEY,
            page,
          },
        },
      );

      return res.data;
    },

    retry: false,
    staleTime: 1000 * 60 * 10, // 10 mins
    gcTime: 1000 * 60 * 30, // 30 mins
  });
}
