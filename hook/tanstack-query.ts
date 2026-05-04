"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { MovieTypes } from "@/types/movie-by-id";
import { CustomListItem } from "@/types/landing-types";

export function useLandingFetchApi({
  custom_list,
  index,
}: {
  custom_list: CustomListItem[];
  index: number;
}) {
  const currentItem = custom_list[index];

  return useQuery<MovieTypes>({
    queryKey: ["get-by-id", currentItem.media_type, currentItem.id],
    enabled: !!currentItem,
    queryFn: async () => {
      const { id, media_type } = currentItem;

      const url = `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=en-US&append_to_response=credits,images,videos,recommendations,reviews,translations,external_ids`;

      const res = await axios.get(url);
      return res.data;
    },

    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}
