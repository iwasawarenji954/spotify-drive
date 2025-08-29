import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SearchTracks from "@/components/party/search-tracks";
import NowPlaying from "@/components/party/now-playing";
import LikeButton from "@/components/party/like-button";

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

      <NowPlaying
        title="Mock Song"
        artist="Mock Artist"
        album="Mock Album"
        imageUrl="/vercel.svg"
      />

      <LikeButton trackId="mock-track-1" initialCount={0} />

      <SearchTracks partyId={partyId} />
    </div>
  );
}
