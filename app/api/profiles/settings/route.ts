import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_AUTH!,
  process.env.SUPABASE_SERVICE_ROLE_KEY_AUTH!,
);

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const google_id = (session.user as any).google_id;
  const activeProfileId = (session.user as any).activeProfileId;

  if (!activeProfileId)
    return NextResponse.json({ error: "No active profile" }, { status: 400 });

  const { data, error } = await supabase
    .from("watch_profiles")
    .select("settings")
    .eq("id", activeProfileId)
    .eq("user_google_id", google_id)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ settings: data.settings });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const google_id = (session.user as any).google_id;
  const activeProfileId = (session.user as any).activeProfileId;

  if (!activeProfileId)
    return NextResponse.json({ error: "No active profile" }, { status: 400 });

  const body = await req.json();
  const { settings } = body;

  if (!settings || typeof settings !== "object")
    return NextResponse.json({ error: "Invalid settings" }, { status: 400 });

  const allowed = [
    "save_history",
    "recommendations",
    "ads",
    "continue_watching",
  ];
  const filtered = Object.fromEntries(
    Object.entries(settings).filter(([k]) => allowed.includes(k)),
  );

  const { data, error } = await supabase
    .from("watch_profiles")
    .update({ settings: filtered })
    .eq("id", activeProfileId)
    .eq("user_google_id", google_id)
    .select("settings")
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ settings: data.settings });
}
