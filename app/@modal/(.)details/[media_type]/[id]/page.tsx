"use client";
import useMovieById from "@/hook/get-movie-by-id";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tailspin } from "ldrs/react";
import "ldrs/react/Tailspin.css";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IMAGE_BASE_URL } from "@/constants/tmdb";
import { useLastPlayed } from "@/store/now-playing-store";
import { Download, Play, Square, TextSearch } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Recommendations from "./recommendations";
import Genres from "./genres";
import { Button } from "@/components/ui/button";
import Credits from "./credits";
import { formatRuntime } from "@/lib/runtime";
import useYouTubePlayer from "@/hook/youtube-api";
import SeasonSelectorPoster from "./season-selector-poster";
import { useSeasonStore } from "@/store/season";
import Episodes from "./episodes";
import { Separator } from "@/components/ui/separator";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import "ldrs/react/Waveform.css";
import { MediaSkeleton } from "./skeleton";
import Link from "next/link";

import { useAdLinkStore } from "@/store/ad-store";
import useDownload from "@/hook/download";
import { Badge } from "@/components/ui/badge";
import { getAdLink } from "@/lib/adLinks";
import { cn } from "@/lib/utils";
export default function ModalDetails() {
  const searchParams = useSearchParams();
  const openAd = useAdLinkStore((s) => s.openAd);
  const [seasonDownload, setSeasonDownload] = useState<number | null>(null);
  const [episodeDownload, setEpisodeDownload] = useState<number | null>(null);
  const [triggerDownload, setTriggerDownload] = useState(false);
  const [loadedBackdrop, setLoadedBackdrop] = useState(false);
  const [loadedLogo, setLoadedLogo] = useState(false);
  const paramsObject = Object.fromEntries(searchParams.entries());
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);
  const media_type = String(params.media_type);
  const query = useMovieById({ id, media_type });
  const handleCloseDrawer = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setTimeout(() => {
        router.back();
      }, 300);
    }
  };
  const adUrl = getAdLink();
  const setLastPlayed = useLastPlayed((s) => s.setLastPlayed);
  const setMainPlayerActive = useLastPlayed((s) => s.setMainPlayerActive);
  const lastId = useLastPlayed((s) => s.lastId);
  const lastMediaType = useLastPlayed((s) => s.media_type);
  const season = useLastPlayed((s) => s.season);
  const episode = useLastPlayed((s) => s.episode);
  const isMainPlayerActive = useLastPlayed((s) => s.isMainPlayerActive);

  const data = query.data ?? null;
  const loading = query.isLoading;
  const [expanded, setExpanded] = useState(false);
  const truncated = data?.overview
    .slice(0, 168)
    .split(" ")
    .slice(0, -1)
    .join(" ");
  //Seasons
  const { setSeasonSelect, getSeasonSelect } = useSeasonStore();
  const saved = getSeasonSelect(id);
  const filtered =
    data?.seasons?.filter(
      (meow) => meow.name !== "Specials" && meow.episode_count,
    ) ?? [];
  //RECO
  const recommendations = data?.recommendations.results ?? [];
  const logo =
    data?.images.logos.find(
      (meow) => meow.iso_639_1 === "en" && meow.vote_average < 5,
    )?.file_path || data?.images.logos[0]?.file_path;
  const credits = data?.credits.cast;
  const trailerKey = data?.videos.results.find(
    (meow) => meow.type === "Trailer",
  )?.key;

  useEffect(() => {
    if (!saved && data?.seasons?.length) {
      const last = filtered[filtered.length - 1];
      setSeasonSelect(id, {
        name: last.name,
        number: last.season_number,
      });
    }
  }, [data]);
  const imdbId = data?.external_ids.imdb_id || null;
  const title = data?.title || data?.name || "";
  const backdrop =
    data?.images.backdrops.find((f) => f.iso_639_1 === "en")?.file_path || "";
  const year = data?.first_air_date || data?.release_date || "";
  const { data: download, isLoading } = useDownload({
    media_type,
    id,
    season: seasonDownload,
    episode: episodeDownload,
    imdbId,
    title,
    year,
    trigger: triggerDownload,
  });
  const selectedSeason =
    media_type === "tv" &&
    data?.seasons.find((s) => s.season_number === seasonDownload);
  return (
    <Drawer open={open} onOpenChange={(value) => handleCloseDrawer(value)}>
      <DrawerContent className=" outline-none">
        <DrawerHeader className="sr-only">
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>

        {loading ? (
          <MediaSkeleton />
        ) : data === null ? (
          <div className="flex flex-col items-center gap-5">
            <span className="p-3 bg-card border-2 rounded-full">
              <TextSearch />
            </span>
            <div className="text-center">
              <p className="">No data found</p>
            </div>
          </div>
        ) : (
          <div className="relative bg-background z-60 overflow-auto custom-scrollbar rounded-t-md">
            <div className="relative sm:aspect-video aspect-square w-full  overflow-hidden">
              <img
                src={
                  data?.backdrop_path
                    ? `${IMAGE_BASE_URL}/w1280${data.backdrop_path}`
                    : "https://github.com/shadcn.png"
                }
                alt={data.title ?? data.name}
                className={cn(
                  "object-cover object-center bg-background pointer-events-none h-full w-full transition duration-300",
                  loadedBackdrop ? "opacity-100" : "opacity-0",
                )}
                onLoad={() => setLoadedBackdrop(true)}
              />

              {data?.genres && (
                <div className="absolute lg:top-5 top-2 lg:left-8 left-3 flex lg:gap-6 gap-3 items-center z-10">
                  <Genres genres={data?.genres} />
                </div>
              )}

              <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background pointer-events-none " />

              <div className="absolute inset-0 bg-linear-to-bl from-transparent  via-transparent to-background pointer-events-none " />
              <div className="absolute bottom-0 left-0 lg:p-8 p-2 lg:space-y-12 space-y-6">
                <div className="lg:space-y-6 space-y-3">
                  {data?.tagline && (
                    <p className="lg:text-base text-sm font-light text-zinc-300 italic leading-relaxed lg:max-w-2xl max-w-2xs ">
                      {data.tagline}
                    </p>
                  )}

                  <div className="lg:mb-8 mb-3 lg:max-w-sm max-w-58   overflow-hidden">
                    {!logo ? (
                      <h1 className="lg:text-6xl text-4xl  font-bold">
                        {data?.title || data?.name}
                      </h1>
                    ) : (
                      <img
                        src={`${IMAGE_BASE_URL}/w780${logo}`}
                        alt={data?.title || data?.name}
                        className={cn(
                          " w-full lg:max-h-40 max-h-30 object-contain object-left transition duration-200",
                          loadedLogo ? "opacity-100" : "opacity-0",
                        )}
                        onLoad={() => setLoadedLogo(true)}
                      />
                    )}
                  </div>
                </div>
                <div className="flex lg:gap-4 gap-3 items-center">
                  <Button variant="accent" size="xl" asChild>
                    <Link
                      href={{
                        pathname: `/watch/${media_type}/${id}`,
                        query: paramsObject,
                      }}
                      onClick={() => {
                        setLastPlayed(
                          media_type === "tv"
                            ? {
                                id: id,
                                media_type: "tv",
                                season: 1,
                                episode: 1,
                              }
                            : {
                                id: id,
                                media_type: "movie",
                              },
                        );
                        setMainPlayerActive(true);
                        openAd();
                      }}
                    >
                      {isMainPlayerActive &&
                      id === lastId &&
                      media_type === lastMediaType ? (
                        <Square className="fill-current" />
                      ) : (
                        <Play className=" fill-current" />
                      )}
                      {isMainPlayerActive &&
                      id === lastId &&
                      media_type === lastMediaType
                        ? "Stop Playing"
                        : "Play Now"}
                    </Link>
                  </Button>

                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <Button
                        size="xl"
                        variant="outline"
                        asChild
                        onClick={() => setTriggerDownload(true)}
                      >
                        <Link href={adUrl} target="_blank">
                          <Download />
                          Download
                        </Link>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="mt-3">
                      <PopoverHeader>
                        <PopoverTitle>Download {title}</PopoverTitle>
                        <PopoverDescription>
                          Select a quality you want to download
                        </PopoverDescription>
                      </PopoverHeader>

                      {media_type === "tv" && (
                        <div className="mt-5 space-y-3">
                          <div className="flex justify-between items-center">
                            <h1 className="text-sm text-muted-foreground font-medium">
                              Select Season
                            </h1>
                            <Select
                              value={seasonDownload?.toString()}
                              onValueChange={(value) => {
                                const season = Number(value);
                                setSeasonDownload(season);
                                setEpisodeDownload(null); // reset episode
                              }}
                            >
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select season" />
                              </SelectTrigger>

                              <SelectContent>
                                <SelectGroup>
                                  {data.seasons.map((s) => (
                                    <SelectItem
                                      key={s.id}
                                      value={s.season_number.toString()}
                                    >
                                      {s.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>

                          {seasonDownload !== null && selectedSeason && (
                            <div className="space-y-1.5">
                              <h1 className="text-sm text-muted-foreground font-medium">
                                Select Episode
                              </h1>
                              <div className="flex gap-1 flex-wrap max-h-50 overflow-auto pr-1 custom-scrollbar">
                                {Array.from(
                                  { length: selectedSeason.episode_count },
                                  (_, i) => (
                                    <Button
                                      key={i}
                                      className="flex-1"
                                      variant={
                                        episodeDownload === i + 1
                                          ? "destructive"
                                          : "secondary"
                                      }
                                      onClick={() => {
                                        setTriggerDownload(true);
                                        setEpisodeDownload(i + 1);
                                      }}
                                    >
                                      Episode {i + 1}
                                    </Button>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {media_type === "tv" ? (
                        seasonDownload === null || episodeDownload === null ? (
                          <div className="flex justify-center items-center p-8">
                            <p className="text-sm text-muted-foreground">
                              Downloads will show here.
                            </p>
                          </div>
                        ) : (
                          <div className="mt-5">
                            <h1 className="text-sm font-medium">
                              Season {seasonDownload} Episode {episodeDownload}
                            </h1>
                            <div className="divide-y">
                              {isLoading ? (
                                <div className="flex justify-center items-center p-8">
                                  <Tailspin
                                    size="30"
                                    stroke="5"
                                    speed="0.9"
                                    color="white"
                                  />
                                </div>
                              ) : !download ? (
                                <div className="flex justify-center items-center p-8">
                                  <p className="text-sm text-muted-foreground">
                                    No download links available
                                  </p>
                                </div>
                              ) : (
                                download?.links.map((d) => (
                                  <div
                                    className="flex justify-between items-center py-3"
                                    key={d.id}
                                  >
                                    <div>
                                      <span className="space-y-1">
                                        <span className="flex gap-2 items-center">
                                          <Badge variant="secondary">
                                            {formatBytes(Number(d.size))}
                                          </Badge>
                                          <h1 className="text-sm font-medium">
                                            {d.resolution}p
                                          </h1>
                                        </span>
                                        <p className="text-sm text-muted-foreground">
                                          {title}.mp4
                                        </p>
                                      </span>
                                    </div>

                                    <Button asChild variant="outline">
                                      <Link href={d.url}>
                                        <Download />
                                      </Link>
                                    </Button>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )
                      ) : (
                        <div className=" mt-5 divide-y">
                          {isLoading ? (
                            <div className="flex justify-center items-center p-8">
                              <Tailspin
                                size="30"
                                stroke="5"
                                speed="0.9"
                                color="white"
                              />
                            </div>
                          ) : !download ? (
                            <div className="flex justify-center items-center p-8">
                              <p className="text-sm text-muted-foreground">
                                No download links available
                              </p>
                            </div>
                          ) : (
                            download?.links.map((d) => (
                              <div
                                className="flex justify-between items-center py-3"
                                key={d.id}
                              >
                                <div>
                                  <span className="space-y-1">
                                    <span className="flex gap-2 items-center">
                                      <Badge variant="secondary">
                                        {formatBytes(Number(d.size))}
                                      </Badge>
                                      <h1 className="text-sm font-medium">
                                        {d.resolution}p
                                      </h1>
                                    </span>
                                    <p className="text-sm text-muted-foreground">
                                      {title}.mp4
                                    </p>
                                  </span>
                                </div>

                                <Button asChild variant="outline">
                                  <Link href={d.url}>
                                    <Download />
                                  </Link>
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>

                  {/* <WatchlistButton movie={data} media_type={media_type} /> */}
                </div>
              </div>
            </div>

            <div className="relative lg:p-8 p-2  lg:space-y-12 space-y-6">
              <div className="space-y-4">
                <div className="h-px w-16 bg-zinc-700 " />
                <div className="flex items-center lg:gap-6 gap-3 text-sm md:text-base lg:mb-8 mb-4">
                  {(data?.vote_average ?? 0) > 0 && (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="lg:text-3xl text-2xl font-bold text-red-500">
                          {data?.vote_average.toFixed(1)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          / 10
                        </div>
                      </div>
                      <div className="h-8 w-px bg-white/10"></div>
                    </>
                  )}
                  {(data?.release_date || data?.first_air_date) && (
                    <>
                      <div className="text-muted-foreground">
                        {new Date(
                          data.release_date ?? data.first_air_date,
                        ).getFullYear()}
                      </div>

                      <div className="h-8 w-px bg-white/10"></div>
                    </>
                  )}

                  <div className="text-muted-foreground uppercase">
                    {data?.runtime
                      ? formatRuntime(data.runtime)
                      : data?.number_of_seasons
                        ? `S${data?.number_of_seasons}E${data.number_of_seasons}`
                        : "N/A"}
                  </div>
                </div>
                {data?.overview && (
                  <p
                    className={`md:text-base text-sm leading-loose text-muted-foreground lg:max-w-2xl`}
                  >
                    {expanded ? (
                      <>
                        {data.overview}{" "}
                        <span
                          className="text-red-500 hover:underline"
                          onClick={() => setExpanded(false)}
                        >
                          see less
                        </span>
                      </>
                    ) : data.overview.length > 200 ? (
                      <>
                        {truncated}{" "}
                        <span
                          className="text-red-500 hover:underline"
                          onClick={() => setExpanded(true)}
                        >
                          ...see more
                        </span>
                      </>
                    ) : (
                      data.overview
                    )}
                  </p>
                )}
              </div>
              {credits && credits.length > 0 && <Credits credits={credits} />}
              {data && media_type === "tv" && (
                <>
                  <SeasonSelectorPoster seasons={filtered} id={id} />
                  <Episodes id={id} />
                </>
              )}
              <Separator />
              {recommendations.length !== 0 && (
                <Recommendations recommendations={recommendations} />
              )}
            </div>
          </div>
        )}

        <ScrollToTop />
      </DrawerContent>
    </Drawer>
  );
}
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
