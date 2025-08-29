import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <div className="max-w-xl mx-auto p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">ダッシュボード</h1>
        <SignOutButton />
      </div>

      <p className="text-sm opacity-80">
        ようこそ、{session.user?.name ?? "ゲスト"} さん
      </p>

      <div className="grid gap-4">
        <Link
          href="/party/create"
          className="block rounded-lg border border-foreground/15 p-4 hover:bg-foreground/5"
        >
          新しいパーティーを作成する
        </Link>

        <form
          action={async (formData) => {
            "use server";
            const code = String(formData.get("code") || "").trim();
            if (code) {
              redirect(`/party/${encodeURIComponent(code)}`);
            }
          }}
          className="flex gap-2"
        >
          <input
            name="code"
            placeholder="参加コード"
            className="flex-1 rounded-md border border-foreground/15 px-3 py-2 bg-transparent"
          />
          <button
            type="submit"
            className="rounded-md bg-foreground text-background px-4 py-2"
          >
            参加
          </button>
        </form>
      </div>
    </div>
  );
}
