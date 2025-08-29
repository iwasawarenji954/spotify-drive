import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { createPartyAction } from "./actions";

export default async function CreatePartyPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <div className="max-w-xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-xl font-semibold">パーティーを作成</h1>
      <p className="opacity-70">まずはモックとして参加コードを自動生成します。</p>

      <form action={createPartyAction}>
        <button
          type="submit"
          className="rounded-md bg-foreground text-background px-4 py-2"
        >
          参加コードを発行してルームへ
        </button>
      </form>

      <div className="rounded-lg border border-foreground/15 p-4">
        <h2 className="font-medium mb-2">今後の予定</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm opacity-80">
          <li>ホストのSpotifyプレイリスト選択（新規作成/既存選択）</li>
          <li>共有用URLと参加コードの表示</li>
          <li>Supabase/Prismaへパーティー情報を保存</li>
        </ul>
      </div>
    </div>
  );
}
