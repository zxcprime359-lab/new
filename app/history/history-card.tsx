import { IMAGE_BASE_URL } from "@/constants/tmdb";
import Link from "next/link";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRemoveFromWatchHistory } from "@/hook/account/history";
export default function HistoryCard({
  m,
  poster = true,
  isDelete,
}: {
  m: any;
  poster?: boolean;
  isDelete: boolean;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [loaded, setLoaded] = useState(false);
  const { mutate: remove, isPending } = useRemoveFromWatchHistory();
  const progressPercent =
    m.duration_seconds > 0
      ? Math.min(
          Math.max((m.watched_seconds / m.duration_seconds) * 100, 0),
          100,
        )
      : 0;
  const progressColor = `hsl(${(progressPercent / 100) * 120}, 100%, 50%)`;
  const year = m.released_date
    ? String(new Date(m.released_date).getFullYear())
    : null;

  return (
    <div
      ref={ref}
      className="relative group transition-all duration-200 space-y-1.5 active:scale-98"
    >
      <Link
        href={`/watch/${m.media_type}/${m.tmdb_id}${m.media_type === "tv" ? `/${m.season}/${m.episode}` : ""}`}
        prefetch={false}
      >
        <div
          className={cn(
            "relative p-0.5 ",
            poster ? "aspect-2/3" : "aspect-video",
          )}
        >
          {/* Red gradient on hover (bottom) */}
          <div className="absolute inset-0 bg-linear-to-t from-red-600 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative overflow-hidden h-full w-full">
            {inView && (
              <img
                loading="lazy"
                src={`${IMAGE_BASE_URL}/w780/${poster ? m.poster_path : m.backdrop_path}`}
                alt={m.title}
                className={cn(
                  "relative z-10 w-full h-full object-cover transition duration-300",
                  loaded ? "opacity-100" : "opacity-0",
                )}
                onLoad={() => setLoaded(true)}
              />
            )}

            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-background/90 opacity-0 group-hover:opacity-100 transition duration-200 z-10" />

            <div className="absolute inset-x-0 bottom-0 z-20 p-2">
              <div className=" h-1 bg-white/10 rounded-xs overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-300",
                    progressPercent >= 95 ? "bg-green-500" : "bg-red-600",
                  )}
                  style={{
                    width: `${progressPercent > 0 ? Math.max(progressPercent, 3) : 0}%`,
                    backgroundColor: progressColor,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Link>

      {isDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="secondary"
              className="absolute top-1 right-1 z-10 "
            >
              <Minus />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <Button
                disabled={isPending}
                onClick={() =>
                  remove({
                    tmdb_id: m.tmdb_id,
                    media_type: m.media_type,
                    season: m.season,
                    episode: m.episode,
                  })
                }
              >
                Continue
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {/* Title below card */}
      <div className=" mt-1 text-center">
        <h1 className="line-clamp-1 font-medium">
          {m.title} {m.media_type === "tv" && `(S${m.season}E${m.episode})`}
        </h1>

        <span className="text-sm text-muted-foreground">{m.main_genre}</span>
      </div>
    </div>
  );
}
