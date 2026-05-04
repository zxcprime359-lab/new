import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoginPage = pathname === "/login";
  const isProfileSelect = pathname.startsWith("/login/profiles");

  // 1. Not logged in → block profile selection only
  if (!token && isProfileSelect) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2. All logged-in rules
  if (token) {
    // Profile selected → block /login and /login/profiles
    if (token.activeProfileId) {
      if (isLoginPage || isProfileSelect) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // No profile yet → block /login, force profile selection everywhere
    if (!token.activeProfileId) {
      if (isLoginPage || !isProfileSelect) {
        return NextResponse.redirect(new URL("/login/profiles", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
