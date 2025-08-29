export default function PartyNotFound() {
  return (
    <div className="max-w-xl mx-auto p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">パーティーが見つかりません</h1>
      <p className="opacity-80">参加コードが無効か、削除された可能性があります。</p>
      <a
        href="/dashboard"
        className="inline-block rounded-md bg-foreground text-background px-4 py-2 mt-2"
      >
        ダッシュボードへ戻る
      </a>
    </div>
  );
}

