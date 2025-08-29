"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="rounded-full border border-foreground/20 px-4 py-2 hover:bg-foreground/10"
    >
      サインアウト
    </button>
  );
}

