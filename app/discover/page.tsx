import { Suspense } from "react";
import ExploreTmdb from "@/app/explore";

export default function DiscoverMovies() {
  return (
    <Suspense>
      <ExploreTmdb media_type="movie" />
    </Suspense>
  );
}
