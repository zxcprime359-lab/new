"use client";
import axios from "axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { MovieTypes } from "@/types/movie-by-id";
export interface ReusableSwiperTypes {
  media_type: string;
  keyword_id: number | null;
}
interface DiscoverResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: MovieTypes[];
}
export default function useGetDiscoverSearch({
  media_type,
  keyword_id,
}: ReusableSwiperTypes) {
  return useInfiniteQuery<DiscoverResponse>({
    queryKey: ["reusable_infinite_search", keyword_id, media_type],
    enabled: !!keyword_id,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await axios.get(
        `https://api.themoviedb.org/3/discover/${media_type}`,
        {
          params: {
            api_key: process.env.NEXT_PUBLIC_TMDB_KEY,
            page: pageParam,
            with_keywords: keyword_id,
          },
        },
      );

      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    retry: false,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
}
