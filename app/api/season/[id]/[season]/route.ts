import { NextRequest, NextResponse } from "next/server";

const TMDB_KEY = process.env.TMDB_API_KEY;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const id = segments[segments.length - 2];
  const season = segments[segments.length - 1];

  if (isNaN(Number(season))) {
    return NextResponse.json(
      { error: "Season must be a number" },
      { status: 400 },
    );
  }
  if (!season || !id) {
    return NextResponse.json({ error: "Missing" }, { status: 400 });
  }

  try {
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${TMDB_KEY}`,
      { next: { revalidate: 300 } },
    );

    if (!tmdbRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch TMDB" },
        { status: tmdbRes.status },
      );
    }

    const data = await tmdbRes.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error details:", err);
    return NextResponse.json(
      {
        error: "Server error",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
