"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useUpsertContinueWatching,
  useRemoveFromContinueWatching,
  useFinishWatching,
} from "@/hook/account/progress-save";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function WatchPage({
  hasActiveProfile,
}: {
  hasActiveProfile: boolean;
}) {
  const [open, setOpen] = useState(true);
  const { params } = useParams();
  const media_type = String(params?.[0]);
  const id = String(params?.[1]);
  const season = Number(params?.[2]) || 1;
  const episode = Number(params?.[3]) || 1;
  const router = useRouter();
  const { mutate: upsertProgress } = useUpsertContinueWatching();
  const { mutate: finishWatching } = useFinishWatching();
  const metadataRef = useRef<any>(null);

  const handleCloseDrawer = (value: boolean) => {
    setOpen(value);
    if (!value) setTimeout(() => router.back(), 300);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://zxcstream.xyz") return;

      const { type, payload } = event.data;

      if (type === "METADATA") {
        console.log("payload", payload);
        metadataRef.current = payload;
      }

      if (type === "VIDEO_PROGRESS") {
        const currentTime = Math.floor(payload.currentTime || 0);
        const duration = payload.duration
          ? Math.floor(Number(payload.duration))
          : null;
        const meta = metadataRef.current || {};

        if (hasActiveProfile) {
          upsertProgress({
            tmdb_id: id,
            media_type,
            season: media_type === "tv" ? season : 0,
            episode: media_type === "tv" ? episode : 0,
            title: meta.title ?? id,
            released_date: meta.year ?? null,
            main_genre: meta.genre ?? null,
            poster_path: meta.poster ?? null,
            backdrop_path: meta.backdrop ?? null,
            progress_seconds: currentTime,
            duration_seconds: duration || null,
          });
        }
      }

      if (type === "VIDEO_NINETY_PERCENT") {
        const duration = payload.duration
          ? Math.floor(Number(payload.duration))
          : 0;
        const meta = metadataRef.current || {};

        if (hasActiveProfile) {
          finishWatching({
            tmdb_id: id,
            media_type,
            season: media_type === "tv" ? season : 0,
            episode: media_type === "tv" ? episode : 0,
            title: meta.title ?? id,
            released_date: meta.year ?? null,
            main_genre: meta.genre ?? null,
            poster_path: meta.poster ?? null,
            backdrop_path: meta.backdrop ?? null,
            watched_seconds: duration,
            duration_seconds: duration,
          });
        }
      }

      if (type === "VIDEO_ENDED") {
        console.log("ended");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleCloseDrawer}>
      <DialogContent
        showCloseButton={false}
        className="h-full w-full! bg-black"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <iframe
          height="100%"
          width="100%"
          src={`https://zxcstream.xyz/player/${media_type}/${id}${media_type === "tv" ? `/${season}/${episode}` : ""}?back=true&domainAd=zxcprime.icu&load_progress=false&save_progress=false`}
          allowFullScreen
          loading="lazy"
        />
      </DialogContent>
    </Dialog>
  );
}
