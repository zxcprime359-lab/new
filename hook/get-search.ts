"use client";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
export interface ReusableSwiperTypes {
  query: string | null;
  media_type: string;
  enable?: boolean;
}

interface TMDBResponse<T> {
  page: number;
  total_pages: number;
  total_results: number;
  results: T[];
}

export default function useSearch<T>({
  query,
  media_type,
  enable,
}: ReusableSwiperTypes) {
  const [debouncedQuery] = useDebounce(query, 500);
  return useInfiniteQuery<TMDBResponse<T>>({
    queryKey: ["search_infinite", debouncedQuery, media_type],
    enabled: !!debouncedQuery && enable,
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axios.get(`/api/search/${media_type}`, {
        params: {
          query: debouncedQuery,
          page: pageParam,
        },
      });
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
