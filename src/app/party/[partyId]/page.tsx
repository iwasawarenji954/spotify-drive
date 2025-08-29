import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import RoomClient from "@/components/party/room-client";
import SharePanel from "@/components/party/share-panel";

export default async function PartyRoom({
  params,
}: {
  params: Promise<{ partyId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const { partyId } = await params;

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-xl font-semibold">パーティールーム #{partyId}</h1>

      <SharePanel partyId={partyId} />

      <RoomClient partyId={partyId} />
    </div>
  );
}
