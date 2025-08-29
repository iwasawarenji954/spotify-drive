"use client";

import { useActionState } from "react";
import type { SearchState, TrackMock } from "@/app/party/[partyId]/search-actions";
import { searchTracksAction } from "@/app/party/[partyId]/search-actions";

export default function SearchTracks({
  partyId,
  onAdd,
  existingIds = [],
}: {
  partyId: string;
  onAdd?: (t: TrackMock) => void;
  existingIds?: string[];
}) {
  const initial: SearchState = { query: "", results: [] };
  const [state, formAction, pending] = useActionState(searchTracksAction, initial);

  return (
    <section className="rounded-lg border border-foreground/15 p-4">
      <h2 className="font-medium mb-3">楽曲検索（モック）</h2>
      <form action={formAction} className="flex gap-2 items-center mb-4">
        <input
          type="text"
          name="q"
          placeholder="曲名やアーティスト名で検索"
          className="flex-1 rounded-md border border-foreground/15 px-3 py-2 bg-transparent"
          defaultValue={state.query}
          aria-label="検索キーワード"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-foreground text-background px-4 py-2 disabled:opacity-50"
        >
          {pending ? "検索中..." : "検索"}
        </button>
      </form>

      {state.results.length === 0 ? (
        <p className="opacity-70 text-sm">キーワードを入力して検索してください（API未接続のモック結果）。</p>
      ) : (
        <ul className="space-y-2">
          {state.results.map((t: TrackMock) => {
            const isAdded = existingIds.includes(t.id);
            return (
            <li
              key={t.id}
              className="flex items-center justify-between rounded-md border border-foreground/10 p-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={t.imageUrl}
                  alt="album art"
                  width={32}
                  height={32}
                  className="rounded"
                />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{t.title}</div>
                  <div className="truncate text-xs opacity-70">
                    {t.artist} ・ {t.album}
                  </div>
                </div>
              </div>
              {isAdded ? (
                <span className="text-xs px-2 py-1 rounded bg-foreground/10 opacity-80">追加済み</span>
              ) : onAdd ? (
                <button
                  type="button"
                  onClick={() => onAdd(t)}
                  title={`パーティー ${partyId} に追加（モック）`}
                  className="rounded-md border border-foreground/20 px-3 py-1.5 text-sm hover:bg-foreground/10"
                >
                  追加
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  title={`パーティー ${partyId} に追加（モック）`}
                  className="rounded-md border border-foreground/20 px-3 py-1.5 text-sm opacity-60"
                >
                  追加（未実装）
                </button>
              )}
            </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
