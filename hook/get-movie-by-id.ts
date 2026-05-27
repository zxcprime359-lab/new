"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { MovieTypes } from "@/types/movie-by-id";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY;

export default function useMovieById({
  media_type,
  id,
  enabled,
}: {
  media_type: string;
  id: string;
  enabled?: boolean;
}) {
  return useQuery<MovieTypes>({
    queryKey: ["get-by-id", id, media_type],
    enabled: !!id && !!media_type && enabled,
    queryFn: () =>
      axios
        .get<MovieTypes>(`https://api.themoviedb.org/3/${media_type}/${id}`, {
          params: {
            api_key: TMDB_API_KEY,
            append_to_response:
              "credits,images,videos,recommendations,external_ids,reviews",
          },
        })
        .then((res) => res.data),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}
