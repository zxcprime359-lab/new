import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import crypto from "crypto";
export interface ProxiedVideoLink {
  id: string;
  resolution: number;
  size: string; // API returns it as string
  url: string; // proxied URL
}

export interface ProxiedApiResponse {
  success: boolean;
  links: ProxiedVideoLink[];
  api_key: string; // IP used for proxy
}

export default function useDownload({
  media_type,
  id,
  season,
  episode,
  imdbId,
  title,
  year,
  trigger,
}: {
  media_type: string;
  id: string;
  season: number | null;
  episode: number | null;
  imdbId: string | null;
  title: string;
  year: string;
  trigger: boolean;
}) {
  const isNumeric = /^\d+$/.test(id);
  const query = useQuery<ProxiedApiResponse>({
    queryKey: [
      "download",
      id,
      media_type,
      season,
      episode,
      imdbId,
      title,
      year,
    ],
    enabled:
      trigger &&
      !!id &&
      !!imdbId &&
      (media_type === "movie" ||
        (media_type === "tv" && !!season && !!episode)) &&
      !isNumeric,
    queryFn: async () => {
      const payload = {
        id,
        media_type,
        season,
        episode,
        imdbId,
        title,
        year,
      };
      const tokenRes = await axios.post("/zxcprime-backend/token", payload);
      const { token, signature } = tokenRes.data;

      const res = await axios.get(
        `/zxcprime-backend/download?data=${encodeURIComponent(token)}&sig=${signature}`,
      );

      return res.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}

export function generateFrontendToken(id: string) {
  const f_ts = Date.now();
  const f_token = crypto
    .createHash("sha256")
    .update(`${id}:${f_ts}`)
    .digest("hex");
  return { f_token, f_ts };
}
// https://fmovies4u.com/api/movie/353081
