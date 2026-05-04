"use client";
import ExploreTmdb from "@/app/explore";
import { useParams } from "next/navigation";

export default function DiscoverMovies() {
  const params = useParams();
  const parameter = String(params.parameter);
  return <ExploreTmdb media_type="movie" />;
}
