"use client";
import BrowseTmdb from "@/app/browse";
import ExploreTmdb from "@/app/explore";
import { useParams } from "next/navigation";

export default function BrowseMovies() {
  const params = useParams();
  const parameter = String(params.parameter);
  return <BrowseTmdb media_type="movie" parameter={parameter} />;
}
