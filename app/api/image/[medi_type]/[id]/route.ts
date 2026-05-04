// import { NextRequest, NextResponse } from "next/server";

// const TMDB_KEY = process.env.TMDB_API_KEY;

// export async function GET(req: NextRequest) {
//   const url = new URL(req.url);
//   const segments = url.pathname.split("/").filter(Boolean);
//   const media_type = segments[segments.length - 2];
//   const id = segments[segments.length - 1];

//   if (!media_type || !id) {
//     return NextResponse.json({ error: "Missing" }, { status: 400 });
//   }

//   try {
//     const tmdbRes = await fetch(
//       `https://api.themoviedb.org/3/${media_type}/${id}/images?api_key=${TMDB_KEY}`,
//       {
//         next: {
//           revalidate: 86400, // 24 hours (or even longer)
//         },
//       },
//     );

//     if (!tmdbRes.ok) {
//       return NextResponse.json(
//         { error: "Failed to fetch TMDB" },
//         { status: tmdbRes.status },
//       );
//     }

//     const data = await tmdbRes.json();

//     return NextResponse.json(data);
//   } catch (err) {
//     console.error("Error details:", err);
//     return NextResponse.json(
//       {
//         error: "Server error",
//         message: err instanceof Error ? err.message : String(err),
//       },
//       { status: 500 },
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";

const TMDB_KEY = process.env.TMDB_API_KEY;

type TMDBImage = {
  aspect_ratio: number;
  height: number;
  width: number;
  file_path: string;
  iso_639_1: string | null; // ✅ this is the language field
  iso_3166_1: string | null; // this is the country field
  vote_average: number;
  vote_count: number;
};
type TMDBImagesResponse = {
  backdrops: TMDBImage[];
  logos: TMDBImage[];
  posters: TMDBImage[];
  id: number;
};
function firstEnglish(images: TMDBImage[]): TMDBImage[] {
  const found =
    images.find((img) => img.iso_639_1 === "en") ??
    images.find((img) => img.iso_639_1 === null); // fallback to language-neutral
  return found ? [found] : [];
}
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const media_type = segments[segments.length - 2];
  const id = segments[segments.length - 1];

  if (!media_type || !id) {
    return NextResponse.json({ error: "Missing" }, { status: 400 });
  }

  try {
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/${media_type}/${id}/images?api_key=${TMDB_KEY}`,
      { next: { revalidate: 86400 } },
    );

    if (!tmdbRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch TMDB" },
        { status: tmdbRes.status },
      );
    }

    const data: TMDBImagesResponse = await tmdbRes.json();
    const filtered = {
      backdrops: firstEnglish(data.backdrops ?? []),
      logos: firstEnglish(data.logos ?? []),
    };

    return NextResponse.json(filtered);
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
