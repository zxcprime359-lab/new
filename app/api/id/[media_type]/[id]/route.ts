import { NextRequest, NextResponse } from "next/server";
import { decryptId, encryptId } from "../../../enc";

const TMDB_KEY = process.env.TMDB_API_KEY;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const media_type = segments[segments.length - 2];
  const encryptedIdFromUrl = segments[segments.length - 1];
  const decode = decodeURIComponent(encryptedIdFromUrl);
  if (!media_type || !decode) {
    return NextResponse.json({ error: "Missing" }, { status: 400 });
  }

  try {
    // Decrypt the ID first
    const realId = decryptId(decode);

    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/${media_type}/${realId}?api_key=${TMDB_KEY}&language=en-US&append_to_response=credits,images,videos,recommendations,external_ids`,
      { next: { revalidate: 300 } },
    );

    if (!tmdbRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch TMDB" },
        { status: tmdbRes.status },
      );
    }

    const data = await tmdbRes.json();

    delete data.budget;

    delete data.homepage;
    delete data.adult;
    delete data.adult;
    delete data.credits.crew;
    delete data.production_companies;
    delete data.production_countries;
    delete data.spoken_languages;
    // Encrypt the ID for response
    const encryptedIdForResponse = encryptId(String(data.id));
    data.id = encodeURIComponent(encryptedIdForResponse);

    // Encrypt recommendations IDs
    if (data.recommendations?.results) {
      data.recommendations.results = data.recommendations.results.map(
        (item: any) => ({ ...item, id: encryptId(String(item.id)) }),
      );
    }

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
