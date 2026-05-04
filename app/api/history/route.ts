import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_AUTH!,
  process.env.SUPABASE_SERVICE_ROLE_KEY_AUTH!,
);

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.activeProfileId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 40), 100);
  const cursor = searchParams.get("cursor");

  // const { data, error } = await supabase
  //   .from("watch_history")
  //   .select("*")
  //   .eq("watch_profile_id", session.user.activeProfileId)
  //   .order("watched_at", { ascending: false });

  let query = supabase
    .from("watch_history")
    .select("*")
    .eq("watch_profile_id", session.user.activeProfileId)
    .order("watched_at", { ascending: false })
    .limit(limit + 1); // +1 to detect if there's a next page

  if (cursor) {
    query = query.lt("watched_at", cursor);
  }
  const { data, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const hasNextPage = data.length > limit;
  const items = hasNextPage ? data.slice(0, limit) : data;
  const nextCursor = hasNextPage ? items[items.length - 1].watched_at : null;

  return NextResponse.json({ items, nextCursor });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.activeProfileId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tmdb_id, media_type, season, episode } = await req.json();

  if (!tmdb_id || !media_type)
    return NextResponse.json(
      { error: "tmdb_id and media_type are required" },
      { status: 400 },
    );

  let query = supabase
    .from("watch_history")
    .delete()
    .eq("watch_profile_id", session.user.activeProfileId)
    .eq("tmdb_id", String(tmdb_id))
    .eq("media_type", media_type);

  if (media_type === "tv") {
    query = query.eq("season", season).eq("episode", episode);
  }

  const { error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
