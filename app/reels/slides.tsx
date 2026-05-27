import { IMAGE_BASE_URL } from "@/constants/tmdb";
import useMovieById from "@/hook/get-movie-by-id";
import { MovieTypes } from "@/types/movie-by-id";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useSwiperSlide } from "swiper/react";
import ReactPlayer from "react-player";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
export default function Slides({
  movie,
  muted,
  setMuted,
}: {
  movie: MovieTypes;
  muted: boolean;
  setMuted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { isActive } = useSwiperSlide();

  const { data } = useMovieById({
    id: movie.id,
    media_type: movie.media_type,
    enabled: isActive,
  });

  const primaryVideo = data?.videos.results
    .filter(
      (v) =>
        v.site === "YouTube" &&
        ["Teaser", "Trailer"].includes(v.type) &&
        v.official,
    )
    .sort((a, b) => {
      if (a.type === "Teaser" && b.type !== "Teaser") return -1;
      if (b.type === "Teaser" && a.type !== "Teaser") return 1;
      return (
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      );
    })?.[0];

  const videoUrl = primaryVideo
    ? `https://www.youtube.com/embed/${primaryVideo.key}?controls=0`
    : null;

  return (
    <div className="relative h-full w-full flex">
      {/* Full screen poster */}
      <div className="relative mx-auto lg:aspect-12/16 aspect-9/16 lg:w-fit w-full bg-black">
        <AnimatePresence mode="wait">
          {videoUrl && isActive ? (
            <motion.div
              key="player"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <ReactPlayer
                src={videoUrl}
                playing={isActive}
                muted={muted}
                loop
                width="100%"
                height="100%"
                // className="pointer-events-none"
              />
            </motion.div>
          ) : (
            <motion.img
              key="poster"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={`${IMAGE_BASE_URL}/w780/${movie.poster_path ?? movie.backdrop_path}`}
              alt={movie.title ?? movie.name ?? ""}
              className="absolute inset-0 object-cover h-full w-full"
            />
          )}
        </AnimatePresence>
        <div className="absolute z-10 h-1/3 w-full  top-0 "></div>
        <div className="absolute z-10 h-1/3 w-full  bottom-0"></div>
        <button
          onClick={() => setMuted((prev) => !prev)}
          className="absolute z-20 top-4 lg:-right-20 right-2 size-10 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        {/* Action buttons */}
        <div className="absolute z-10 bottom-8 lg:-right-20 right-2 flex flex-col items-center lg:gap-5 gap-3">
          {[
            { icon: <Play />, label: "Play" },
            { icon: <Heart />, label: movie.vote_count },
            { icon: <MessageCircle />, label: "Comment" },
            { icon: <Share2 />, label: "Share" },
            { icon: <Bookmark />, label: "Save" },
          ].map(({ icon, label }) => (
            <button key={label} className="flex flex-col items-center gap-1">
              <div className="size-12 rounded-full lg:bg-card bg-card/50 backdrop-blur-md  flex items-center justify-center">
                {icon}
              </div>
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Top fade */}
      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-transparent pointer-events-none" />

      {/* Bottom fade */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-16 p-4 pb-8">
        <h2 className="font-bold text-2xl leading-snug">
          {movie.title ?? movie.name}
        </h2>
        <p className="text-white/60 text-sm mt-1">
          ★ {movie.vote_average?.toFixed(1)} &nbsp;·&nbsp;
          {(movie.release_date ?? movie.first_air_date ?? "").slice(0, 4)}
        </p>
        <span
          className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            movie.media_type === "tv"
              ? "bg-emerald-500/30 text-emerald-300"
              : "bg-blue-500/30 text-blue-300"
          }`}
        >
          {movie.media_type === "tv" ? "TV Series" : "Movie"}
        </span>
      </div>
    </div>
  );
}
