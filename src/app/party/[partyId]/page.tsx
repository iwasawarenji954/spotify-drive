import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

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

      <section className="rounded-lg border border-foreground/15 p-4">
        <h2 className="font-medium mb-2">再生中</h2>
        <div className="opacity-70">まだ実装されていません</div>
      </section>

      <div className="flex gap-3">
        <button className="rounded-full bg-[#1DB954] text-white px-6 py-3 font-medium hover:opacity-90">
          いいね！
        </button>
        <button className="rounded-full border border-foreground/20 px-6 py-3 hover:bg-foreground/10">
          曲を検索・追加
        </button>
      </div>
    </div>
  );
}
