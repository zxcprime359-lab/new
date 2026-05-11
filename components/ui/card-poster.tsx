import { IMAGE_BASE_URL } from "@/constants/tmdb";
import { MovieTypes } from "@/types/movie-by-id";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import WatchlistButton from "./button-watchlist";
import { movieGenres } from "@/constants/filter";
import { cn } from "@/lib/utils";
export default function MovieCard({
  movie,
  media_type,
}: {
  movie: MovieTypes;
  media_type: string;
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [loaded, setLoaded] = useState(false);

  const main_genre = movieGenres.find((g) => g.id === movie.genre_ids[0])?.name;
  const poster_path = movie.poster_path;
  const backdrop_path = movie.backdrop_path;
  const title = movie.title || movie.name;
  const released_date = movie.release_date ?? movie.first_air_date;
  const isRecent =
    released_date &&
    Date.now() - new Date(released_date).getTime() <= 30 * 24 * 60 * 60 * 1000;
  const year = String(
    new Date(movie.release_date || movie.first_air_date).getFullYear(),
  );

  return (
    <div
      ref={ref}
      className="group transition-all duration-200 space-y-1.5 max-w-65 active:scale-95  "

      // onMouseEnter={() => router.prefetch(`/details/movie/${movie.id}`)}
    >
      <Link
        href={{
          pathname: `/details/${media_type}/${movie.id}`,
        }}
        prefetch={false}
      >
        <div className="relative p-0.5 aspect-2/3 ">
          <div className="absolute inset-0 bg-linear-to-t from-red-600 rounded-sm via-transparent to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
          <div className="relative overflow-hidden h-full w-full rounded-sm">
            {inView && (
              <img
                loading="lazy"
                src={`${IMAGE_BASE_URL}/w780/${movie.poster_path}`}
                alt={movie.title}
                className={cn(
                  "relative z-10 w-full h-full object-cover transition duration-300 ",
                  loaded ? "opacity-100 " : "opacity-0",
                )}
                onLoad={() => setLoaded(true)}
              />
            )}
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-background/90 opacity-0 group-hover:opacity-100 transition duration-200 z-10"></div>
            {isRecent && (
              <div
                className={`absolute z-10 bottom-0 bg-linear-to-b from-red-700 to-red-900 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 lg:px-6 rounded-t-xs py-0.5 lg:text-sm text-[0.7rem] lg:font-medium
                         `}
              >
                Recently Added
              </div>
            )}

            <span className="absolute top-1 right-1 z-10 lg:p-1.5 p-0.5 bg-background/50 backdrop-blur-md lg:text-sm text-xs font-medium rounded-sm">
              {year}
            </span>
          </div>

          <WatchlistButton
            id={movie.id}
            media_type={media_type}
            title={title}
            released_date={released_date}
            main_genre={main_genre}
            poster_path={poster_path}
            backdrop_path={backdrop_path}
          />
        </div>
      </Link>
    </div>
  );
}
