import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_AUTH!,
  process.env.SUPABASE_SERVICE_ROLE_KEY_AUTH!,
);

const MAX_PROFILES = 5;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const google_id = (session.user as any).google_id;

  const { data, error } = await supabase
    .from("watch_profiles")
    .select("id, name, avatar_type, is_kids, has_pin, created_at")
    .eq("user_google_id", google_id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profiles: data });
}
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const google_id = (session.user as any).google_id;

  const { count, error: countError } = await supabase
    .from("watch_profiles")
    .select("id", { count: "exact", head: true })
    .eq("user_google_id", google_id);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  if ((count ?? 0) >= MAX_PROFILES) {
    return NextResponse.json(
      { error: `Maximum of ${MAX_PROFILES} profiles allowed.` },
      { status: 400 },
    );
  }

  const body = await req.json();
  const { name, avatar_type = "svg1", is_kids = false, pin } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  if (pin !== undefined && pin !== null && !/^\d{4}$/.test(pin)) {
    return NextResponse.json(
      { error: "PIN must be exactly 4 digits." },
      { status: 400 },
    );
  }
  const pin_hash = pin ? await bcrypt.hash(pin, 10) : null;
  const { data, error } = await supabase
    .from("watch_profiles")
    .insert({
      user_google_id: google_id,
      name: name.trim(),
      avatar_type,
      is_kids,
      pin_hash,
      has_pin: !!pin,
    })
    .select("id, name, avatar_type, is_kids, pin_hash, has_pin, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data }, { status: 201 });
}
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const google_id = (session.user as any).google_id;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing profile id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("watch_profiles")
    .delete()
    .eq("id", id)
    .eq("user_google_id", google_id); // 🔒 important security check

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const google_id = (session.user as any).google_id;

  const body = await req.json();
  const { id, name, avatar_type, is_kids, pin } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing profile id" }, { status: 400 });
  }

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (pin !== undefined && pin !== null && !/^\d{4}$/.test(pin)) {
    return NextResponse.json(
      { error: "PIN must be exactly 4 digits" },
      { status: 400 },
    );
  }
  const pinFields =
    pin !== undefined
      ? { pin_hash: await bcrypt.hash(pin, 10), has_pin: true }
      : {};
  const { data, error } = await supabase
    .from("watch_profiles")
    .update({
      name: name.trim(),
      avatar_type,
      is_kids,
      ...pinFields,
    })
    .eq("id", id)
    .eq("user_google_id", google_id) // 🔒 security
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
