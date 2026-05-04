"use client";
import { IMAGE_BASE_URL } from "@/constants/tmdb";
import { WatchlistItem } from "@/hook/account/watchlist";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import WatchlistButton from "@/components/ui/button-watchlist";

export default function WatchlistCard({
  m,
  idx,
}: {
  m: WatchlistItem;
  idx: number;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="group relative">
      <div className={cn("relative p-0.5 group")}>
        <Link href={`/details/${m.media_type}/${m.tmdb_id}`}>
          <div className="group-hover:opacity-100 opacity-0 duration-200 transition absolute inset-0  bg-linear-to-b p-0.5 to-red-600 from-transparent"></div>
          <div className="relative h-full w-full ">
            <img
              src={`${IMAGE_BASE_URL}/w780/${m.poster_path}`}
              className={`w-full h-full object-cover transition-opacity duration-500`}
            />

            <div
              className={cn(
                "absolute inset-0 z-10 bg-linear-to-b to-background/90 from-transparent group-hover:opacity-100 opacity-0 transition duration-200",
              )}
            ></div>
          </div>
        </Link>
      </div>
      <div className=" mt-1 text-center">
        <h1 className="line-clamp-1 font-medium">{m.title}</h1>

        <span className="text-sm text-muted-foreground">{m.main_genre}</span>
      </div>
      <WatchlistButton
        id={m.tmdb_id}
        media_type={m.media_type}
        title={m.title}
        released_date={m.released_date}
        main_genre={m.main_genre}
        poster_path={m.poster_path}
        backdrop_path={m.backdrop_path}
      />
    </div>
  );
}
