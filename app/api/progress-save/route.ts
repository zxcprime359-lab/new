import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_AUTH!,
  process.env.SUPABASE_SERVICE_ROLE_KEY_AUTH!,
);

// GET — fetch continue watching list for active profile
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.activeProfileId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("continue_watching")
    .select("*")
    .eq("watch_profile_id", session.user.activeProfileId)
    .order("last_watched_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const active = data?.filter(
    (item) => new Date(item.last_watched_at) >= cutoff,
  );
  const dropped = data?.filter(
    (item) => new Date(item.last_watched_at) < cutoff,
  );
  return NextResponse.json({ active, dropped });
}

// POST — upsert progress (insert or update on conflict)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.activeProfileId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (!body.tmdb_id || !body.title || !body.media_type) {
    return NextResponse.json(
      { error: "tmdb_id, title and media_type are required" },
      { status: 400 },
    );
  }

  if (body.progress_seconds == null) {
    return NextResponse.json(
      { error: "progress_seconds is required" },
      { status: 400 },
    );
  }

  const { error } = await supabase.from("continue_watching").upsert(
    {
      watch_profile_id: session.user.activeProfileId,
      tmdb_id: String(body.tmdb_id),
      media_type: body.media_type,
      season: body.season ?? 0,
      episode: body.episode ?? 0,
      title: body.title,
      released_date: body.released_date ?? null,
      main_genre: body.main_genre ?? null,
      poster_path: body.poster_path ?? null,
      backdrop_path: body.backdrop_path ?? null,
      progress_seconds: body.progress_seconds,
      duration_seconds: body.duration_seconds ?? null,
      last_watched_at: new Date().toISOString(),
    },
    {
      onConflict: "watch_profile_id,tmdb_id,media_type,season,episode",
    },
  );

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.activeProfileId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    tmdb_id,
    media_type,
    season = 0,
    episode = 0,
    finished = false,
  } = body;

  if (!tmdb_id || !media_type) {
    return NextResponse.json(
      { error: "tmdb_id and media_type are required" },
      { status: 400 },
    );
  }

  // finished = true → use RPC (saves to history + deletes)
  if (finished) {
    if (!body.title || !body.watched_seconds || !body.duration_seconds) {
      return NextResponse.json(
        {
          error:
            "title, watched_seconds and duration_seconds are required when finished",
        },
        { status: 400 },
      );
    }

    const { error } = await supabase.rpc("finish_watching", {
      p_watch_profile_id: session.user.activeProfileId,
      p_tmdb_id: String(tmdb_id),
      p_media_type: media_type,
      p_season: season,
      p_episode: episode,
      p_title: body.title,
      p_released_date: body.released_date ?? null,
      p_main_genre: body.main_genre ?? null,
      p_poster_path: body.poster_path ?? null,
      p_backdrop_path: body.backdrop_path ?? null,
      p_watched_seconds: body.watched_seconds,
      p_duration_seconds: body.duration_seconds,
    });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  // finished = false → just delete (manual removal)
  const { error } = await supabase
    .from("continue_watching")
    .delete()
    .eq("watch_profile_id", session.user.activeProfileId)
    .eq("tmdb_id", String(tmdb_id))
    .eq("media_type", media_type)
    .eq("season", season)
    .eq("episode", episode);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
