import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_AUTH!,
  process.env.SUPABASE_SERVICE_ROLE_KEY_AUTH!,
);

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.activeProfileId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("watchlist")
    .select("*")
    .eq("watch_profile_id", session.user.activeProfileId)
    .order("added_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.activeProfileId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: {
    tmdb_id: string;
    media_type: string;
    title: string;
    released_date?: string | null;
    main_genre?: string | null;
    poster_path?: string | null;
    backdrop_path?: string | null;
  } = await req.json();

  if (!body.tmdb_id || !body.media_type || !body.title)
    return NextResponse.json(
      { error: "tmdb_id, media_type and title are required" },
      { status: 400 },
    );

  const { error } = await supabase.from("watchlist").upsert(
    {
      watch_profile_id: session.user.activeProfileId,
      tmdb_id: String(body.tmdb_id),
      media_type: body.media_type,
      title: body.title,
      released_date: body.released_date ?? null,
      main_genre: body.main_genre ?? null,
      poster_path: body.poster_path ?? null,
      backdrop_path: body.backdrop_path ?? null,
    },
    {
      onConflict: "watch_profile_id,tmdb_id,media_type",
    },
  );

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.activeProfileId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tmdb_id, media_type } = await req.json();

  if (!tmdb_id || !media_type)
    return NextResponse.json(
      { error: "tmdb_id and media_type are required" },
      { status: 400 },
    );

  const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("watch_profile_id", session.user.activeProfileId)
    .eq("tmdb_id", String(tmdb_id))
    .eq("media_type", media_type);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
