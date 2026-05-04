import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_AUTH!,
  process.env.SUPABASE_SERVICE_ROLE_KEY_AUTH!,
);

type Params = { params: { id: string } };

// POST /api/profiles/[id]/verify-pin
// Body: { pin: string }
export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const google_id = (session.user as any).google_id;

  const { data: profile, error } = await supabase
    .from("watch_profiles")
    .select("pin")
    .eq("id", params.id)
    .eq("user_google_id", google_id)
    .single();

  if (error || !profile) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  if (!profile.pin) {
    return NextResponse.json({ valid: true });
  }

  const body = await req.json();
  const { pin } = body;

  if (!pin || typeof pin !== "string") {
    return NextResponse.json({ error: "PIN is required." }, { status: 400 });
  }

  return NextResponse.json({ valid: profile.pin === pin });
}
