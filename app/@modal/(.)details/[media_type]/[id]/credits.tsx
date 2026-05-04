import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IMAGE_BASE_URL } from "@/constants/tmdb";
import { useIsMobile } from "@/hook/use-mobile";
import { CastMemberTypes } from "@/types/movie-by-id";

export default function Credits({ credits }: { credits: CastMemberTypes[] }) {
  const isMobile = useIsMobile();
  const limit = isMobile ? 4 : 6;
  const visible = credits.slice(0, limit);

  const remaining = credits.length - limit;
  return (
    <div className="space-y-4">
      <h1>Casts</h1>
      <div className="flex ">
        {visible?.map((meow) => (
          <div
            key={meow.id}
            className="*:data-[slot=avatar]:ring-background  space-y-2 *:data-[slot=avatar]:ring-3 items-center "
          >
            <Avatar key={meow.id} className="lg:size-25 size-17">
              <AvatarImage
                className="object-cover"
                src={
                  meow.profile_path
                    ? `${IMAGE_BASE_URL}/w780${meow.profile_path}`
                    : "https://github.com/shadcn.png"
                }
                alt="@shadcn"
              />
              <AvatarFallback className="uppercase">
                {meow.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <p className="text-center text-sm text-muted-foreground">
              {meow.name.split(" ")[0]}
            </p>
          </div>
        ))}

        {remaining > 0 && (
          <div className="grid place-items-center p-2 text-xl font-semibold text-red-500">
            +{remaining}
          </div>
        )}
      </div>
    </div>
  );
}
