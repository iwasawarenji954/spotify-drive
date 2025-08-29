"use client";

import { useMemo, useState } from "react";
import NowPlaying from "@/components/party/now-playing";
import LikeButton from "@/components/party/like-button";
import SearchTracks from "@/components/party/search-tracks";
import type { TrackMock } from "@/app/party/[partyId]/search-actions";

export default function RoomClient({ partyId }: { partyId: string }) {
  const [queue, setQueue] = useState<TrackMock[]>([]);

  const onAdd = (t: TrackMock) => {
    setQueue((prev) => {
      if (prev.some((p) => p.id === t.id)) return prev;
      return [...prev, t];
    });
  };

  const hasQueue = queue.length > 0;
  const queueCount = queue.length;

  return (
    <>
      <NowPlaying
        title="Mock Song"
        artist="Mock Artist"
        album="Mock Album"
        imageUrl="/vercel.svg"
      />

      <LikeButton trackId="mock-track-1" initialCount={0} />

      <SearchTracks partyId={partyId} onAdd={onAdd} />

      <section className="rounded-lg border border-foreground/15 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium">キュー（モック）</h2>
          <span className="text-sm opacity-70">{queueCount} 件</span>
        </div>
        {!hasQueue ? (
          <p className="opacity-70 text-sm">まだ曲はありません。検索から追加してみましょう。</p>
        ) : (
          <ul className="space-y-2">
            {queue.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-md border border-foreground/10 p-2"
              >
                <img
                  src={t.imageUrl}
                  alt="album art"
                  width={28}
                  height={28}
                  className="rounded"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{t.title}</div>
                  <div className="truncate text-xs opacity-70">{t.artist}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setQueue((prev) => prev.filter((p) => p.id !== t.id))}
                  className="text-xs rounded-md border border-foreground/20 px-2 py-1 hover:bg-foreground/10"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

