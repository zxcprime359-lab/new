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

export default function BackdropCard({
  data,
  media_type,

  //
  isKids,
}: {
  data: MovieTypes;
  media_type: string;
  isKids: boolean;
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
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
    <div className="group relative" ref={ref}>
      <div className="relative group p-0.5  bg-linear-to-b hover:to-red-600 from-transparent active:scale-98 transition duration-150 ">
        <div
          className={cn(
            "aspect-video  transition cursor-pointer relative  overflow-hidden",
            isKids ? "w-sm" : "lg:w-2xs md:w-3xs w-50",
          )}
        >
          <Link
            href={{
              pathname: `/details/${media_type}/${data.id}`,
              query: paramsObject,
            }}
            prefetch={false}
          >
            {/* {query.isLoading && <Skeleton className="h-full w-full" />} */}
            {backdrop && inView && (
              <img
                src={`${IMAGE_BASE_URL}/w780/${backdrop}`}
                alt={data.title}
                className={`w-full h-full object-cover transition-opacity duration-500  ${loaded ? "opacity-100 " : "opacity-0"}`}
                onLoad={() => setLoaded(true)}
              />
            )}

            {isRecent && (
              <div
                className={`absolute z-10 bottom-0 bg-linear-to-b from-red-700 to-red-900 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 lg:px-6 rounded-t-sm py-0.5 lg:text-sm text-xs font-medium
                         `}
              >
                Recently Added
              </div>
            )}
            <span className="absolute top-1 right-1 z-10 p-1.5 bg-background/50 backdrop-blur-md lg:text-sm text-xs rounded-md font-medium">
              {year}
            </span>
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-background/80 opacity-0 group-hover:opacity-100 transition duration-150"></div>
          </Link>

          <WatchlistButton
            id={data.id}
            media_type={media_type}
            title={title}
            released_date={released_date}
            main_genre={main_genre}
            poster_path={poster_path}
            backdrop_path={backdrop_path}
          />
        </div>
      </div>

      <div className="mt-2 opacity-100 group-hover:opacity-100 transition duration-200">
        <h1
          className={cn(
            " font-normal truncate text-center  lg:max-w-40 max-w-25 mx-auto",
            isKids ? "lg:text-lg text-base" : "lg:text-base text-sm",
          )}
        >
          {data.title ?? data.name}
        </h1>

        <span
          className={cn(
            " text-muted-foreground flex justify-center items-center gap-1",
            isKids ? "lg:text-base text-sm" : "lg:text-sm text-xs",
          )}
        >
          {main_genre || "N/A"}
        </span>
      </div>
    </div>
  );
}
