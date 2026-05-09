"use client";
import { IMAGE_BASE_URL } from "@/constants/tmdb";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ContinueWatchingItem,
  useRemoveFromContinueWatching,
} from "@/hook/account/progress-save";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { useSwiperSlide } from "swiper/react";
import { Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DatabaseCard({
  data,
  trash,
}: {
  data: ContinueWatchingItem;
  trash: boolean;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { isVisible } = useSwiperSlide();
  const [loaded, setLoaded] = useState(false);
  const searchParams = useSearchParams();
  const paramsObject = {
    ...Object.fromEntries(searchParams.entries()),
    progress: data.progress_seconds,
  };
  const { mutate: removeProgress, isPending: isDeleting } =
    useRemoveFromContinueWatching();

  const progressPercent =
    data.duration_seconds && data.duration_seconds > 0
      ? Math.min((data.progress_seconds / data.duration_seconds) * 100, 100)
      : 0;
  const progressColor = `hsl(${(progressPercent / 100) * 120}, 100%, 50%)`;
  const href =
    data.media_type === "tv"
      ? `/watch/${data.media_type}/${data.tmdb_id}/${data.season}/${data.episode}`
      : `/watch/${data.media_type}/${data.tmdb_id}`;

  return (
    <div className=" relative" ref={ref}>
      <div className="group relative p-0.5 bg-linear-to-b hover:to-red-600 from-transparent active:scale-98 transition duration-150">
        <div className="aspect-video lg:w-2xs md:w-3xs w-50 transition cursor-pointer relative overflow-hidden">
          <Link href={{ pathname: href, query: paramsObject }} prefetch={false}>
            {data.backdrop_path && inView && isVisible && (
              <img
                src={`${IMAGE_BASE_URL}/w780/${data.backdrop_path}`}
                alt={data.title}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-500",
                  loaded ? "opacity-100" : "opacity-0",
                )}
                onLoad={() => setLoaded(true)}
              />
            )}

            {/* progress bar */}
            {progressPercent !== null && (
              <div className="absolute bottom-0 left-0 right-0  px-2 py-1 z-30">
                <div className="h-1 bg-white/20">
                  <div
                    className="h-full bg-red-600"
                    style={{
                      width: `${progressPercent > 0 ? Math.max(progressPercent, 3) : 0}%`,
                      backgroundColor: progressColor,
                    }}
                  />
                </div>
              </div>
            )}

            {data.media_type === "tv" && (
              <span className="absolute top-1 left-1 z-10 px-1.5 py-0.5 bg-background/50 backdrop-blur-md text-sm rounded-sm font-medium">
                S{data.season} E{data.episode}
              </span>
            )}

            <span className="absolute top-1 right-1 z-10 px-1.5 py-0.5 bg-background/50 backdrop-blur-md text-sm rounded-sm font-medium">
              {data.released_date}
            </span>

            <div className="absolute inset-0 bg-linear-to-b from-transparent to-background/80 opacity-0 group-hover:opacity-100 transition duration-150" />
          </Link>

          {/* remove button */}
          {trash && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
                  <button className=" flex items-center gap-3">
                    <Trash className="size-5" /> | <span>Remove</span>
                  </button>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancel
                  </AlertDialogCancel>
                  <Button
                    disabled={isDeleting}
                    onClick={() =>
                      removeProgress({
                        tmdb_id: data.tmdb_id,
                        media_type: data.media_type,
                        season: data.season,
                        episode: data.episode,
                      })
                    }
                  >
                    {isDeleting ? "Deleting..." : "Continue"}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="mt-2 transition duration-200">
        <h1 className="font-normal truncate text-center text-sm lg:text-base max-w-40 mx-auto">
          {data.title}
        </h1>
        <span className="text-muted-foreground flex justify-center items-center gap-1 text-xs lg:text-sm">
          {data.main_genre || "N/A"}
        </span>
      </div>
    </div>
  );
}
