"use client";

import LandingPage from "@/components/landing-components/landing-page";
import Trending from "./trending";
import ReusableSwiper from "./reusable-display";
import { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Footer from "@/components/ui/footer";
import StreamProviders from "./stream-provider";
import Weekly from "./weekly";
import ContinueWatching from "./continue";
import BecauseYouWatch from "./because";
import { useContinueWatching } from "@/hook/account/progress-save";
export interface ReusableSwiperTypes {
  id: string;
  endpoint: string;
  params: Record<string, string | number>;
  label?: string;
  displayName: string;
  isVisible?: boolean;
  media_type: string;
  logo?: StaticImageData;
  invert?: boolean;
}

export default function Home({
  isKids,
  hasActiveProfile,
}: {
  isKids: boolean;
  hasActiveProfile: boolean;
}) {
  const [media_type, setMedia] = useState<"all" | "movie" | "tv">("all");
  const { data, isLoading, isError } = useContinueWatching();
  const random =
    data?.active?.[Math.floor(Math.random() * (data?.active.length ?? 0))];

  const kidParams = isKids
    ? {
        "certification.lte": "PG",
        with_genres: "16,10751",
      }
    : undefined;
  const movie_endpoints: ReusableSwiperTypes[] = [
    {
      id: "popular-movie",
      displayName: "Popular Movies",
      media_type: "movie",
      endpoint: "discover",
      params: {
        sort_by: "popularity.desc",
        "vote_count.gte": 200,

        //IF KIDS USE THIS
        ...(kidParams ?? {}),
      },
    },
    {
      id: "top-rated-movie",
      displayName: "Top Rated Movies",
      media_type: "movie",
      endpoint: "discover",
      params: {
        sort_by: "vote_average.desc",
        "vote_count.gte": 1000,

        //IF KIDS USE THIS
        ...(kidParams ?? {}),
      },
    },
    {
      id: "psychological-thriller",
      displayName: "Marvel Cinematic Universe",
      media_type: "movie",
      endpoint: "discover",
      params: {
        with_keywords: 180547,
        sort_by: "vote_average.desc",
        "vote_count.gte": 200,

        //IF KIDS USE THIS
        ...(kidParams ?? {}),
      },
    },
  ];
  const tv_endpoints: ReusableSwiperTypes[] = [
    {
      id: "popular-tv",
      displayName: "Popular Series",
      media_type: "tv",
      endpoint: "discover",
      params: {
        sort_by: "popularity.desc",
        "vote_count.gte": 200,
      },
    },
    {
      id: "top-rated-tv",
      displayName: "Top Rated Series",
      media_type: "tv",
      endpoint: "discover",
      params: {
        sort_by: "vote_average.desc", // ✅ highest rated
        "vote_count.gte": 1000, // 🔥 VERY IMPORTANT (avoid fake high ratings)
      },
    },
    {
      id: "adult-animation",
      displayName: "Adult Animation",
      media_type: "tv",
      endpoint: "discover",
      params: {
        with_keywords: 161919,
        sort_by: "vote_average.desc",
        "vote_count.gte": 200,
      },
    },
  ];
  return (
    <div>
      <LandingPage fullSize={false} isKids={isKids} />
      <div className="relative bg-background z-10 space-y-10 lg:space-y-3">
        <div className=" flex justify-center items-center lg:gap-4 gap-2 lg:p-4 p-2 font-medium">
          <span
            className={cn(
              "lg:text-lg md:text-base text-sm  lg:px-4 px-2 py-1.5 rounded-sm cursor-pointer transition duration-200",
              media_type === "all"
                ? "bg-foreground/10 text-foreground"
                : "text-muted-foreground",
            )}
            onClick={() => setMedia("all")}
          >
            Featured
          </span>
          <span
            className={cn(
              "lg:text-lg md:text-base text-sm  lg:px-4 px-2 py-1.5 rounded-sm cursor-pointer transition duration-200",
              media_type === "movie"
                ? "bg-foreground/10 text-foreground"
                : "text-muted-foreground",
            )}
            onClick={() => setMedia("movie")}
          >
            Movies
          </span>
          <span
            className={cn(
              "lg:text-lg md:text-base text-sm  lg:px-4 px-2 py-1.5 rounded-sm cursor-pointer transition duration-200",
              media_type === "tv"
                ? "bg-foreground/10 text-foreground"
                : "text-muted-foreground",
            )}
            onClick={() => setMedia("tv")}
          >
            TV Shows
          </span>
          <span
            className={cn(
              "lg:text-lg md:text-base text-sm text-muted-foreground lg:px-4 px-2 py-1.5 rounded-sm cursor-not-allowed",
              // media_type === "anime" ? "bg-white/10" : "",
            )}
            // onClick={() => setMedia("anime")}
          >
            Anime
          </span>
        </div>
        <div className="lg:pl-35 pl-2 space-y-15 pb-10">
          {/* TOP 10 */}

          {media_type === "all" && (
            <>
              <Trending time_window="day" media_type="all" isKids={isKids} />
              {hasActiveProfile && (
                <ContinueWatching
                  data={data?.active ?? []}
                  isLoading={isLoading}
                />
              )}
              <StreamProviders />

              {hasActiveProfile && data?.active.length !== 0 && random && (
                <BecauseYouWatch random={random} isKids={isKids} />
              )}
              <Weekly />
            </>
          )}

          {media_type === "movie" &&
            movie_endpoints.map((tv) => (
              <ReusableSwiper
                key={tv.id}
                endpoint={tv.endpoint}
                media_type={tv.media_type}
                params={tv.params}
                displayName={tv.displayName}
                //
                isKids={isKids}
              />
            ))}
          {media_type === "tv" &&
            tv_endpoints.map((tv) => (
              <ReusableSwiper
                key={tv.id}
                endpoint={tv.endpoint}
                media_type={tv.media_type}
                params={tv.params}
                displayName={tv.displayName}
                //
                isKids={isKids}
              />
            ))}
          <Footer />
        </div>
      </div>
    </div>
  );
}
