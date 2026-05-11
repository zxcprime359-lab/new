// app/api/profiles/select/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { encode, getToken } from "next-auth/jwt";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_AUTH!,
  process.env.SUPABASE_SERVICE_ROLE_KEY_AUTH!,
);

const SESSION_COOKIE =
  process.env.NODE_ENV === "production"
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { profileId } = body;

  if (!profileId) {
    return NextResponse.json({ error: "Missing profileId" }, { status: 400 });
  }

  const google_id = (session.user as any).google_id;

  const { data: profile, error } = await supabase
    .from("watch_profiles")
    .select("id, name, avatar_type, is_kids") // only select what's needed
    .eq("id", profileId)
    .eq("user_google_id", google_id)
    .single();

  if (error || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET!, // was missing the !
  });

  if (!token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const newToken = await encode({
    token: {
      ...token, // spread instead of mutating
      activeProfileId: profile.id,
      avatarType: profile.avatar_type,
      profileName: profile.name,
      isKids: profile.is_kids,
    },
    secret: process.env.NEXTAUTH_SECRET!,
    maxAge: 30 * 24 * 60 * 60, // was missing, preserves session expiry
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, newToken, COOKIE_OPTIONS);

  return response;
}
