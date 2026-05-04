"use client";
import { IconLoader, IconMovieOff } from "@tabler/icons-react";

import MovieCard from "@/components/ui/card-poster";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import useGetDiscoverInfinite from "@/hook/get-discover-infinite";
import { MovieTypes } from "@/types/movie-by-id";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import SkeletonCard1 from "@/components/ui/movie-card-skeleton-1";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function BrowseTmdb({
  media_type = "movie",
  parameter,
}: {
  media_type: "movie" | "tv";
  parameter: string;
}) {
  const { ref, inView } = useInView({
    threshold: 0.1, // triggers when 50% visible
  });
  const [selectedMedia] = useState<"movie" | "tv">(media_type);
  const [tab, setTab] = useState(parameter);


  const isTrending = tab === "trending";
  const endpoint = isTrending ? "trending" : "discover";

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetDiscoverInfinite<MovieTypes>({
      endpoint,
      media_type: selectedMedia,
      params: {
        ...(tab === "popular" && { sort_by: "popularity.desc" }),
        ...(tab === "top_rated" && {
          sort_by: "vote_average.desc",
          "vote_count.gte": 100,
        }),
        ...(tab === "new_release" && {
          sort_by: "release_date.desc",
          "vote_count.gte": 10,
          "primary_release_date.gte": `${new Date().getFullYear()}-01-01`,
          "primary_release_date.lte": `${new Date().getFullYear()}-12-31`,
        }),
        ...(tab === "horror_favorite" && {
          sort_by: "release_date.desc",
          "vote_count.gte": 200,
          with_genres: 27,
        }),
        ...(tab === "classic_80s" && {
          sort_by: "vote_average.desc",
          "vote_count.gte": 200,
          "primary_release_date.gte": "1980-01-01",
          "primary_release_date.lte": "1989-12-31",
        }),

        ...(tab === "kdrama" && {
          sort_by: "popularity.desc",
          with_original_language: "ko",
          "vote_count.gte": 100,
          media_type: "tv",
        }),
        ...(tab === "kids" && {
          sort_by: "popularity.desc",
          "vote_average.gte": 6,
          with_genres: 16,
          certification_country: "US",
          "certification.lte": "PG",
        }),
        ...(tab === "anime" && {
          sort_by: "popularity.desc",
          with_genres: 16,
          with_keywords: "210024",
          "vote_count.gte": 100,
        }),
        ...(tab === "mind_bender" && {
          sort_by: "popularity.desc",
          with_keywords: "12565",
          "vote_count.gte": 50,
        }),
        ...(tab === "nostalgic" && {
          sort_by: "popularity.desc",
          with_keywords: "164246",
          "primary_release_date.gte": "1970-01-01",
          " primary_release_date.lte": "2005-12-31",
          "vote_count.gte": 20,
        }),
        ...(tab === "superhero" && {
          sort_by: "popularity.desc",
          with_keywords: "9715", // example TMDB keywords: superhero, comic book
          with_genres: 28, // 28 = Action
          " vote_count.gte": 50,
        }),
        ...(tab === "teens" && {
          sort_by: "popularity.desc",
          with_keywords: "11870", // TMDB keywords: teen, high school
          //   with_genres: 35, // 35 = Comedy (optional, most teen movies)
          "vote_count.gte": 20,
        }),
        ...(tab === "mystery_thriller" && {
          sort_by: "popularity.desc",
          with_genres: "9648,53", // 9648 = Mystery, 53 = Thriller
          "vote_count.gte": 20,
        }),
        ...(tab === "quickwatch" && {
          sort_by: "popularity.desc",
          "with_runtime.lte": 90, // movies under 90 minutes
          " vote_count.gte": 10,
        }),
      },
    });
  const results = data?.pages.flatMap((p) => p.results) ?? [];
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className=" space-y-2 py-5 lg:py-25 pl-30">
      <div className="grid grid-cols-7">
        {isLoading ? (
          [...Array(7)].map((_, i) => <SkeletonCard1 key={i} />)
        ) : results.length === 0 ? (
          <div className="col-span-7 flex flex-col justify-center items-center gap-4 py-20">
            <span className="bg-popover p-2 rounded-md">
              <IconMovieOff className="size-10" />
            </span>
            <div className="text-center">
              <h1 className="text-lg font-medium"> No data found.</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Try another filter combination.
              </p>
            </div>
          </div>
        ) : (
          results.map((result, idx) => (
            <MovieCard
              key={`${idx}=${result.id}`}
              movie={result}
              media_type={selectedMedia}
            />
          ))
        )}
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="flex-10" /> {/* biggest */}
            <div className="flex-1 flex flex-col gap-1">
              <Skeleton className="flex-1 w-1/2" /> {/* smaller */}
              <Skeleton className="flex-[0.8] w-1/3" /> {/* smaller */}
            </div>
          </div>
        ))}
        {isFetchingNextPage &&
          [...Array(7)].map((_, i) => (
            <div key={i} className="">
              <Skeleton className="aspect-2/3" />
              <div className="mt-3 space-y-1">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
      </div>
      <div ref={ref} className="grid place-items-center">
        {isFetchingNextPage && (
          <p className="flex gap-2 animate-pulse text-muted-foreground">
            fetching data...
            <IconLoader className="animate-spin" />
          </p>
        )}
      </div>
      <ScrollToTop />
    </div>
  );
}
