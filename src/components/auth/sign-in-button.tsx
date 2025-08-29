"use client";

import { signIn } from "next-auth/react";

export function SignInButton() {
  return (
    <button
      onClick={() => signIn("spotify")}
      className="rounded-full bg-[#1DB954] text-white px-6 py-3 font-medium hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1DB954]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      Spotifyでログイン
    </button>
  );
}
