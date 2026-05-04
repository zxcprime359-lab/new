import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_AUTH!,
  process.env.SUPABASE_SERVICE_ROLE_KEY_AUTH!,
);

type Params = { params: { id: string } };

async function verifyOwnership(
  google_id: string,
  profile_id: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("watch_profiles")
    .select("id")
    .eq("id", profile_id)
    .eq("user_google_id", google_id)
    .single();
  return !!data;
}

// GET /api/profiles/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const google_id = (session.user as any).google_id;
  const owned = await verifyOwnership(google_id, params.id);
  if (!owned)
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });

  const { data, error } = await supabase
    .from("watch_profiles")
    .select("id, name, avatar_type, is_kids, created_at")
    .eq("id", params.id)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ profile: data });
}

// PATCH /api/profiles/[id]
// Body: { name?: string, avatar_type?: string, is_kids?: boolean, pin?: string | null }
export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const google_id = (session.user as any).google_id;
  const owned = await verifyOwnership(google_id, params.id);
  if (!owned)
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });

  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name must be a non-empty string." },
        { status: 400 },
      );
    }
    updates.name = body.name.trim();
  }

  if (body.avatar_type !== undefined) updates.avatar_type = body.avatar_type;
  if (body.is_kids !== undefined) updates.is_kids = Boolean(body.is_kids);

  if (body.pin !== undefined) {
    if (body.pin === null) {
      updates.pin = null;
    } else if (!/^\d{4}$/.test(body.pin)) {
      return NextResponse.json(
        { error: "PIN must be exactly 4 digits." },
        { status: 400 },
      );
    } else {
      updates.pin = body.pin;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No valid fields provided to update." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("watch_profiles")
    .update(updates)
    .eq("id", params.id)
    .select("id, name, avatar_type, is_kids, created_at")
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ profile: data });
}

// DELETE /api/profiles/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const google_id = (session.user as any).google_id;
  const owned = await verifyOwnership(google_id, params.id);
  if (!owned)
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });

  const { error } = await supabase
    .from("watch_profiles")
    .delete()
    .eq("id", params.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
