// app/api/collection/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { encryptId, decryptId } from "../../enc";

const TMDB_KEY = process.env.TMDB_API_KEY;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const id = segments[segments.length - 1];

  if (!id) {
    return NextResponse.json(
      { error: "Collection ID is required" },
      { status: 400 },
    );
  }

  try {
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/collection/${id}?api_key=${TMDB_KEY}&language=en-US`,
      { next: { revalidate: 300 } },
    );

    if (!tmdbRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch collection from TMDB" },
        { status: tmdbRes.status },
      );
    }

    const data = await tmdbRes.json();

    if (data.parts && Array.isArray(data.parts)) {
      data.parts = data.parts.map((movie: any) => ({
        ...movie,
        id: encryptId(String(movie.id)),
      }));
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Collection error:", err);
    return NextResponse.json(
      {
        error: "Server error",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
