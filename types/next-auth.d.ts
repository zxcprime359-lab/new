import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      google_id?: string | null;
      activeProfileId?: string | null;
      avatarType?: string | null;
      profileName?: string | null;
      isKids?: boolean | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    activeProfileId?: string | null;
    avatarType?: string | null;
    profileName?: string | null;
    isKids?: boolean | null;
    sub?: string;
  }
}