import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function CreatePartyPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <div className="max-w-xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-xl font-semibold">パーティーを作成</h1>
      <p className="opacity-70">プレイリスト選択などは後で実装します。</p>
    </div>
  );
}

