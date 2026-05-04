import { NextRequest, NextResponse } from "next/server";
import { encryptId } from "@/app/api/enc";

const TMDB_KEY = process.env.TMDB_API_KEY;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const media_type = segments[segments.length - 1]; // movie or tv
  const page = url.searchParams.get("page") || "1";

  if (!["movie", "tv"].includes(media_type)) {
    return NextResponse.json(
      { error: "Invalid media_type. Must be movie or tv" },
      { status: 400 },
    );
  }

  try {
    const tmdbParams = new URLSearchParams({ api_key: TMDB_KEY!, page });

    // Add all extra query params
    url.searchParams.forEach((value, key) => {
      if (key !== "page") tmdbParams.set(key, value);
    });

    // Trending always uses /day
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/trending/${media_type}/day?${tmdbParams.toString()}`,
      { next: { revalidate: 300 } },
    );

    if (!tmdbRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from TMDB" },
        { status: tmdbRes.status },
      );
    }

    const data = await tmdbRes.json();

    // Encrypt IDs
    if (Array.isArray(data.results)) {
      data.results = data.results.map((item: any) => ({
        ...item,
        id: encryptId(String(item.id)),
      }));
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Trending error:", err);
    return NextResponse.json(
      {
        error: "Server error",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
