// import { authOptions } from "@/lib/auth";
// import { createClient } from "@supabase/supabase-js";
// import { getServerSession } from "next-auth";
// import { NextRequest, NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL_AUTH!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY_AUTH!,
// );

// export async function POST(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { profileId, pin } = await req.json();

//   const { data, error } = await supabase
//     .from("watch_profiles")
//     .select("pin_hash, has_pin")
//     .eq("id", profileId)
//     .single();

//   if (error || !data) {
//     return NextResponse.json({ error: "Profile not found" }, { status: 404 });
//   }

//   if (!data.has_pin) {
//     return NextResponse.json({ success: true });
//   }

//   const isValid = pin === data.pin_hash;

//   if (!isValid) {
//     return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
//   }

//   return NextResponse.json({ success: true });
// }
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_AUTH!,
  process.env.SUPABASE_SERVICE_ROLE_KEY_AUTH!,
);

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { profileId, pin } = await req.json();

  if (!profileId) {
    return NextResponse.json({ error: "Missing profileId" }, { status: 400 });
  }

  if (!pin || !/^\d{4}$/.test(pin)) {
    return NextResponse.json(
      { error: "PIN must be exactly 4 digits" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("watch_profiles")
    .select("pin_hash, has_pin")
    .eq("id", profileId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // If no PIN is set, allow access
  if (!data.has_pin || !data.pin_hash) {
    return NextResponse.json({ success: true });
  }

  // ✅ SECURE CHECK
  const isValid = await bcrypt.compare(pin, data.pin_hash);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
