"use client";
import BrowseTmdb from "@/app/browse";
import { useParams } from "next/navigation";

export default function BrowseMovies() {
  const params = useParams();
  const parameter = String(params.parameter);
  return <BrowseTmdb media_type="tv" parameter={parameter} />;
}
