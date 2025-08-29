import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import RoomClient from "@/components/party/room-client";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PartyRoom({
  params,
}: {
  params: Promise<{ partyId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const { partyId } = await params;

  // DBが有効な場合はコードの存在を確認
  if (process.env.DATABASE_URL) {
    try {
      const party = await prisma.party.findUnique({
        where: { code: partyId },
        select: { id: true, code: true, status: true },
      });
      if (!party) {
        notFound();
      }
    } catch {
      // DBエラー時は既存のモック動作（ページ表示）を継続
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-xl font-semibold">パーティールーム #{partyId}</h1>

      <RoomClient partyId={partyId} />
    </div>
  );
}
