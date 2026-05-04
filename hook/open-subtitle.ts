import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Subtitle {
  id: string;
  language: string;
  languageCode: string;
  downloadLink: string;
  isHearingImpaired: boolean;
}

interface UseSubtitlesParams {
  imdbId: string;
  season?: number;
  episode?: number;
}

export function useOpenSubtitle({
  imdbId,
  season,
  episode,
}: UseSubtitlesParams) {
  return useQuery<Subtitle[], Error>({
    queryKey: ["libreSubs", imdbId, season, episode],
    queryFn: async () => {
      const cleanId = imdbId.replace("tt", "");
      const url =
        season && episode
          ? `https://rest.opensubtitles.org/search/episode-${episode}/imdbid-${cleanId}/season-${season}`
          : `https://rest.opensubtitles.org/search/imdbid-${cleanId}`;

      const { data } = await axios.get(url);

      return data.map((item: any) => ({
        id: item.IDSubtitle,
        language: item.LanguageName,
        languageCode: item.ISO639,
        downloadLink: item.SubDownloadLink.replace("/filead/", "/file/")
          .replace("/src-api/", "/subencoding-utf8/src-api/")
          .replace(".gz", ""),
        isHearingImpaired: item.SubHearingImpaired === "1",
      }));
    },
    enabled: !!imdbId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
}
