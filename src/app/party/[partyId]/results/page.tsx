import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function PartyResults({
  params,
}: {
  params: { partyId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  const { partyId } = params;

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-xl font-semibold">結果発表 #{partyId}</h1>
      <div className="rounded-lg border border-foreground/15 p-4">
        <p className="opacity-70">ランキングと個人スコアは後で実装します。</p>
      </div>
    </div>
  );
}
