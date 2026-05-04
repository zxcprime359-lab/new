import { Skeleton } from "@/components/ui/skeleton";

export function MediaSkeleton() {
  return (
    <div className="flex-1 relative bg-background">
      {/* Genres skeleton */}
      <div className="absolute lg:top-5 top-2 lg:left-8 left-3  flex lg:gap-6 gap-3">
        <Skeleton className="lg:w-18 w-12 lg:h-6 h-4 rounded-full" />
      </div>
      {/* Backdrop Skeleton */}
      <div className="absolute h-[35dvh] overflow-hidden ">
        {/* Home button skeleton */}
        <Skeleton className="absolute top-6 right-6 w-10 h-10 rounded-md" />

        {/* Play controls skeleton */}
        <div className="absolute top-3/4 right-0 flex gap-4 py-3 px-8 border-l-2 border-red-700/30">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="w-px h-5" />
          <Skeleton className="w-5 h-5 rounded" />
        </div>
      </div>
      {/* Content area skeleton */}
      <div className="relative lg:p-8 p-2 lg:mt-30 mt-20 lg:space-y-12 space-y-6">
        {/* Title/Logo skeleton */}
        <div className="lg:space-y-6 space-y-3">
          {/* Tagline skeleton */}
          <Skeleton className="w-full lg:max-w-2xl max-w-2xs lg:h-6 h-4" />
          {/* Logo/Title skeleton */}
          <Skeleton className="w-48 lg:h-16 h-12 rounded-lg" />
        </div>

        {/* Buttons skeleton */}
        <div className="flex lg:gap-4 gap-3 items-center">
          <Skeleton className="lg:w-32 w-25 lg:h-11 h-9 rounded-md" />
          <Skeleton className="lg:size-12 size-10 rounded-full" />
        </div>

        {/* Rating/Info skeleton */}
        <div className="space-y-4">
          <Skeleton className="w-16 h-px" />
          <div className="flex items-center lg:gap-6 gap-3 text-sm lg:text-base lg:mb-8 mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="lg:w-12 w-10 h-8" />
              <Skeleton className="lg:w-10 w-8 h-5" />
            </div>
            <Skeleton className="w-px h-8" />
            <Skeleton className="lg:w-24 w-14 h-5" />
            <Skeleton className="w-px h-8" />
            <Skeleton className="lg:w-20 h-5 w-13" />
          </div>
        </div>

        {/* Overview skeleton */}
        <div className="space-y-2 lg:w-1/2 w-full">
          <Skeleton className="w-full h-4.5" />
          <Skeleton className="w-full h-4.5" />
          <Skeleton className="w-3/4 h-4.5" />
        </div>

        {/* Credits skeleton */}
        <div className="space-y-3">
          <Skeleton className="lg:w-25 w-20 h-6" />
          <div className="flex -space-x-2">
            <Skeleton className="lg:size-25 size-17 rounded-full border-2 border-background" />
            <Skeleton className="lg:size-25 size-17 rounded-full border-2 border-background" />
            <Skeleton className="lg:size-25 size-17 rounded-full border-2 border-background" />
          </div>
        </div>

        {/* Episodes/Recommendations skeleton */}
        <div className="space-y-4">
          <Skeleton className="w-47 h-6 rounded-lg" />
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-2/3" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
