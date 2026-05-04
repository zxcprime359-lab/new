import {
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useWatchlist,
} from "@/hook/account/watchlist";
import { BookmarkFilledIcon, BookmarkIcon } from "../icon/bookmark";
import { Button } from "./button";
import { Plus } from "lucide-react";

export default function WatchlistButton({
  id,
  media_type,
  title,
  released_date,
  main_genre,
  poster_path,
  backdrop_path,
  type = "icon",
}: {
  id: string;
  media_type: string;
  title: string;
  released_date?: string | null;
  main_genre?: string | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
  type?: "icon" | "button";
}) {
  const { mutate: addToWatchlist, isPending: isAdding } = useAddToWatchlist();
  const { mutate: removeFromWatchlist, isPending: isRemoving } =
    useRemoveFromWatchlist();
  const { data: watchlist } = useWatchlist();

  const isInWatchlist =
    watchlist?.some(
      (item) => item.tmdb_id === String(id) && item.media_type === media_type,
    ) ?? false;

  const isPending = isAdding || isRemoving;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWatchlist) {
      removeFromWatchlist({ tmdb_id: id, media_type });
    } else {
      addToWatchlist({
        tmdb_id: id,
        media_type,
        title,
        released_date,
        main_genre,
        poster_path,
        backdrop_path,
      });
    }
  };

  return type === "icon" ? (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="absolute top-1 left-1 z-30 p-1.5 bg-background/50 backdrop-blur-md rounded-xs opacity-0 group-hover:opacity-100 transition duration-150 disabled:opacity-50"
    >
      {isInWatchlist ? <BookmarkFilledIcon /> : <BookmarkIcon />}
    </button>
  ) : (
    <Button
      className="pointer-events-auto rounded-full size-13"
      variant="outline"
      onClick={handleToggle}
      disabled={isPending}
    >
      {isInWatchlist ? <BookmarkIcon /> : <Plus />}
    </Button>
  );
}
