"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

function randomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function createPartyAction() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const hostUserId = session.user?.id ?? "unknown";

  const hasDb = Boolean(process.env.DATABASE_URL);
  let code = randomCode();

  if (hasDb) {
    for (let i = 0; i < 5; i++) {
      try {
        await prisma.party.create({ data: { code, hostUserId } });
        break;
      } catch (e: unknown) {
        const err = e as { code?: string };
        if (err?.code === "P2002") {
          // Unique constraint violation -> regenerate and retry
          code = randomCode();
          continue;
        }
        // Unexpected error: fall back to non-DB flow
        break;
      }
    }
  }

  redirect(`/party/${code}`);
}

