// app/api/subtitles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { decryptId } from "../enc";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const tmdbId = url.searchParams.get("tmdbId");
  const imdbId = url.searchParams.get("imdbId");
  const season = url.searchParams.get("season");
  const episode = url.searchParams.get("episode");

  if (!tmdbId && !imdbId) {
    return NextResponse.json(
      { error: "Either tmdbId or imdbId is required" },
      { status: 400 },
    );
  }

  try {
    let realId: string | undefined;

    // Decrypt tmdbId if provided
    if (tmdbId) {
      const decodedId = decodeURIComponent(tmdbId);
      realId = decryptId(decodedId);
    }

    // Build the subtitle API URL
    const subtitleParams = new URLSearchParams();
    if (realId) subtitleParams.set("id", realId);
    if (imdbId) subtitleParams.set("imdbId", imdbId);
    if (season) subtitleParams.set("season", season);
    if (episode) subtitleParams.set("episode", episode);

    const subtitleUrl = `https://sub.wyzie.ru/search?${subtitleParams.toString()}`;
    console.log("Fetching subtitles from:", subtitleUrl);

    const response = await fetch(subtitleUrl, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch subtitles" },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Sort by language
    data.sort((a: any, b: any) => a.language.localeCompare(b.language));

    return NextResponse.json(data);
  } catch (err) {
    console.error("Subtitles error:", err);
    return NextResponse.json(
      {
        error: "Server error",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
