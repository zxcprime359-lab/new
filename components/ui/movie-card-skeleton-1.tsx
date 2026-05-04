import { Skeleton } from "./skeleton";

export default function SkeletonCard1() {
  return (
    <div className="">
      <Skeleton className="aspect-2/3 w-full" />
      {/* <div className="lg:mt-3 mt-1.5 space-y-1">
        <Skeleton className="lg:h-4 h-3 w-1/2" />
        <Skeleton className="lg:h-3 h-2.5 w-1/3" />
      </div> */}
    </div>
  );
}
