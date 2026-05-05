import { Suspense } from "react";
import ExploreTmdb from "../explore";
export default function Movie() {
  return (
    <Suspense>
      <ExploreTmdb media_type="movie" />
    </Suspense>
  );
}
