"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface TMDBImage {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface ImageTypes {
  id: string;
  backdrops: TMDBImage[];
  posters: TMDBImage[];
  logos: TMDBImage[];
}

export default function useImagesById({
  media_type,
  id,
  enabled,
}: {
  media_type: string;
  id: string;
  enabled: boolean;
}) {
  return useQuery<ImageTypes>({
    queryKey: ["get-images-by-id", id, media_type],
    enabled: !!id && !!media_type && enabled,
    queryFn: () =>
      axios
        .get<ImageTypes>(`/api/image/${media_type}/${id}`)
        .then((res) => res.data),
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
