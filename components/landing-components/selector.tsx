import { cn } from "@/lib/utils";
export default function Selector({
  setMediaTypeAction,
  media_type_action,
}: {
  setMediaTypeAction: (media_type: "all" | "movie" | "tv") => void;
  media_type_action: "all" | "movie" | "tv";
}) {
  return (
    <div className="z-30 absolute inset-x-0 top-0 flex justify-between lg:justify-center items-center lg:gap-4 gap-2 lg:p-8 p-4 font-medium pointer-events-auto ">
      <span
        className={cn(
          "lg:text-lg md:text-base text-sm  lg:px-4 px-2 py-1.5 rounded-sm cursor-pointer transition duration-200",
          media_type_action === "all"
            ? "bg-foreground/10 text-foreground"
            : "text-muted-foreground",
        )}
        onClick={() => setMediaTypeAction("all")}
      >
        Featured
      </span>
      <span
        className={cn(
          "lg:text-lg md:text-base text-sm  lg:px-4 px-2 py-1.5 rounded-sm cursor-pointer transition duration-200",
          media_type_action === "movie"
            ? "bg-foreground/10 text-foreground"
            : "text-muted-foreground",
        )}
        onClick={() => setMediaTypeAction("movie")}
      >
        Movies
      </span>
      <span
        className={cn(
          "lg:text-lg md:text-base text-sm  lg:px-4 px-2 py-1.5 rounded-sm cursor-pointer transition duration-200",
          media_type_action === "tv"
            ? "bg-foreground/10 text-foreground"
            : "text-muted-foreground",
        )}
        onClick={() => setMediaTypeAction("tv")}
      >
        TV Shows
      </span>
      <span
        className={cn(
          "lg:text-lg md:text-base text-sm text-muted-foreground lg:px-4 px-2 py-1.5 rounded-sm cursor-not-allowed",
          // media_type_action === "anime" ? "bg-white/10" : "",
        )}
        // onClick={() => setMedia("anime")}
      >
        Anime
      </span>
    </div>
  );
}
