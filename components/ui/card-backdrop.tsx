"use client";
import { movieGenres } from "@/constants/filter";
import { IMAGE_BASE_URL } from "@/constants/tmdb";
import useImagesById from "@/hook/get-images-by-id";
import { MovieTypes } from "@/types/movie-by-id";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useSwiperSlide } from "swiper/react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import WatchlistButton from "./button-watchlist";
import { Play, Plus, ThumbsUp, ChevronDown } from "lucide-react";

export default function BackdropCard({
  data,
  media_type,
  isKids,
}: {
  data: MovieTypes;
  media_type: string;
  isKids: boolean;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const id = data.id;
  const searchParams = useSearchParams();
  const paramsObject = Object.fromEntries(searchParams.entries());
  const { isVisible } = useSwiperSlide();

  const { data: image, isLoading } = useImagesById({
    media_type,
    id,
    enabled: isVisible,
  });

  const backdrop = isLoading
    ? null
    : (image?.backdrops.find((f) => f.iso_639_1 === "en")?.file_path ??
      data.backdrop_path);

  const poster_path = data.poster_path;
  const backdrop_path = data.backdrop_path;
  const title = data.title || data.name;
  const released_date = data.release_date ?? data.first_air_date;
  const isRecent =
    released_date &&
    Date.now() - new Date(released_date).getTime() <= 30 * 24 * 60 * 60 * 1000;

  const [loaded, setLoaded] = useState(false);
  const main_genre = movieGenres.find((g) => g.id === data.genre_ids[0])?.name;
  const year = String(
    new Date(data.release_date || data.first_air_date).getFullYear(),
  );

  return (
    <div className="group relative z-0 hover:z-50 transition-none" ref={ref}>
      {/* Card inner — scales up on hover */}
      <div
        className={cn(
          "relative transition-transform duration-300 ease-in-out",
          "group-hover:scale-[1.3] group-hover:-translate-y-3",
          "origin-bottom",
          isKids ? "w-sm" : "lg:w-2xs md:w-3xs w-50",
        )}
      >
        {/* Thumbnail */}
        <div className="aspect-video relative overflow-hidden group-hover:rounded-b-none rounded-sm cursor-pointer">
          <Link
            href={{
              pathname: `/details/${media_type}/${data.id}`,
              query: paramsObject,
            }}
            prefetch={false}
          >
            {backdrop && inView && (
              <img
                src={`${IMAGE_BASE_URL}/w780/${backdrop}`}
                alt={title}
                className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setLoaded(true)}
              />
            )}
            {isRecent && (
              <div className="absolute z-10 bottom-0 bg-linear-to-b from-red-700 to-red-900 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 lg:px-6 rounded-t-sm py-0.5 lg:text-sm text-xs font-medium group-hover:scale-85 origin-bottom duration-300 transition">
                Recently Added
              </div>
            )}
            <span className="absolute top-1 right-1 z-10 p-1.5 bg-black/50 backdrop-blur-md lg:text-sm text-xs rounded-md font-medium text-white group-hover:scale-85 origin-top-right duration-300 transition">
              {year}
            </span>
          </Link>
        </div>

        {/* Info panel — slides in below the thumbnail on hover */}
        <div
          className={cn(
            "absolute top-full left-0 right-0",
            "bg-zinc-900 rounded-b-md px-2.5 py-2",
            "opacity-0 group-hover:opacity-100",
            "transition-opacity duration-200 delay-75",
            "shadow-2xl shadow-black/70",
            "pointer-events-none group-hover:pointer-events-auto",
          )}
        >
          {/* Action buttons */}
          <div className="flex items-center gap-1.5 mb-2">
            {/* Play */}
            <Link
              href={{
                pathname: `/details/${media_type}/${data.id}`,
                query: paramsObject,
              }}
              prefetch={false}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-white hover:bg-white/80 transition shrink-0"
            >
              <Play size={11} fill="black" stroke="none" className="ml-0.5" />
            </Link>

            {/* Watchlist */}
            <WatchlistButton
              id={data.id}
              media_type={media_type}
              title={title}
              released_date={released_date}
              main_genre={main_genre}
              poster_path={poster_path}
              backdrop_path={backdrop_path}
            />

            {/* Like */}
            <button className="flex items-center justify-center w-6 h-6 rounded-full border border-white/40 text-white hover:border-white/70 transition shrink-0">
              <ThumbsUp size={11} />
            </button>

            {/* More info — pushes to the right */}
            <Link
              href={{
                pathname: `/details/${media_type}/${data.id}`,
                query: paramsObject,
              }}
              prefetch={false}
              className="ml-auto flex items-center justify-center w-6 h-6 rounded-full border border-white/40 text-white hover:border-white/70 transition shrink-0"
            >
              <ChevronDown size={11} />
            </Link>
          </div>

          {/* Match % + HD badge */}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-green-400 text-[11px] font-semibold">
              {Math.floor(Math.random() * 15 + 83)}% Match
            </span>
            <span className="border border-white/30 text-white/60 text-[9px] px-1 leading-3.5 rounded-xs">
              HD
            </span>
          </div>

          {/* Genre + year */}
          <p className="text-white/60 text-[10px] truncate">
            {main_genre ?? "N/A"} • {year}
          </p>
        </div>
      </div>
    </div>
  );
}
