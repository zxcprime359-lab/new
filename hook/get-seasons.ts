import { SeasonTypes } from "@/types/movie-by-id";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useTvSeason({
  id,
  season_number,
  media_type,
}: {
  id: string;
  season_number?: number;
  media_type: string;
}) {
  const seasonQuery = useQuery<SeasonTypes>({
    queryKey: ["tv-season", id, season_number],
    enabled: !!season_number && media_type === "tv",
    queryFn: async () => {
      const url = `/api/season/${id}/${season_number}`;
      const res = await axios.get(url);
      return res.data;
    },
    retry: false,
  });
  return seasonQuery;
}
