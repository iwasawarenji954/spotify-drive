"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function likeCurrentTrackAction(params: {
  partyCode: string;
  trackId: string;
}) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return { ok: false, liked: false, total: 0, error: "UNAUTHENTICATED" } as const;
  }

  if (!process.env.DATABASE_URL) {
    return { ok: false, liked: false, total: 0, error: "NO_DB" } as const;
  }

  const party = await prisma.party.findUnique({ where: { code: params.partyCode } });
  if (!party) {
    return { ok: false, liked: false, total: 0, error: "NOT_FOUND" } as const;
  }

  // Ensure PartyTrack exists
  const track = await prisma.partyTrack.upsert({
    where: { partyId_trackId: { partyId: party.id, trackId: params.trackId } },
    create: { partyId: party.id, trackId: params.trackId, addedBy: userId },
    update: {},
    select: { id: true },
  });

  // Create like (idempotent)
  try {
    await prisma.like.create({ data: { partyTrackId: track.id, userId } });
  } catch (e: unknown) {
    // P2002: unique constraint violation -> already liked
  }

  const total = await prisma.like.count({ where: { partyTrackId: track.id } });
  return { ok: true, liked: true, total } as const;
}

export async function getLikeCountAction(params: {
  partyCode: string;
  trackId: string;
}) {
  if (!process.env.DATABASE_URL) {
    return { ok: false, total: 0, error: "NO_DB" } as const;
  }
  const party = await prisma.party.findUnique({ where: { code: params.partyCode } });
  if (!party) {
    return { ok: false, total: 0, error: "NOT_FOUND" } as const;
  }
  const track = await prisma.partyTrack.findUnique({
    where: { partyId_trackId: { partyId: party.id, trackId: params.trackId } },
    select: { id: true },
  });
  if (!track) return { ok: true, total: 0 } as const;
  const total = await prisma.like.count({ where: { partyTrackId: track.id } });
  return { ok: true, total } as const;
}
