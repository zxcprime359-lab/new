import { Suspense } from "react";
import ExploreTmdb from "../explore";
export default function TVShows() {
  return (
    <Suspense>
      <ExploreTmdb media_type="tv" />
    </Suspense>
  );
}
