import type { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email%20playlist-modify-public%20playlist-modify-private",
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      if (profile && typeof profile === "object" && "id" in profile) {
        const maybeId = (profile as { id?: unknown } | null | undefined)?.id;
        if (typeof maybeId === "string" || typeof maybeId === "number") {
          token.sub = String(maybeId);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.sub === "string" ? token.sub : undefined;
        session.user.accessToken =
          typeof token.accessToken === "string" ? token.accessToken : undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
