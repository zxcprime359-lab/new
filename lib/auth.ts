import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";
import type { NextAuthOptions } from "next-auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_AUTH!,
  process.env.SUPABASE_SERVICE_ROLE_KEY_AUTH!,
);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ profile }) {
      const { data: existing } = await supabase
        .from("users")
        .select("google_id")
        .eq("google_id", profile!.sub)
        .single();

      if (existing) {
        await supabase
          .from("users")
          .update({ last_login: new Date().toISOString() })
          .eq("google_id", profile!.sub);
      } else {
        await supabase.from("users").insert({
          google_id: profile!.sub,
          email: profile!.email,
          name: profile!.name,
          avatar_url: (profile as any).picture,
        });
      }

      return true;
    },

    async jwt({ token, trigger, session }) {
      if (trigger === "update") {
        token.activeProfileId = session?.activeProfileId ?? null;
        token.avatarType = session?.avatarType ?? null;
        token.profileName = session?.profileName ?? null;
        token.isKids = session?.isKids ?? null;
      }
      return token;
    },

    // 🔥 UPDATE THIS
    async session({ session, token }) {
      if (session.user) {
        session.user.google_id = token.sub;
        session.user.activeProfileId = token.activeProfileId ?? null;
        session.user.avatarType = token.avatarType ?? null;
        session.user.profileName = token.profileName ?? null;
        session.user.isKids = token.isKids ?? null;
      }
      return session;
    },
  },
};
