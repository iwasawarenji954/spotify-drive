"use client";

import { useEffect, useState } from "react";
import NowPlaying from "@/components/party/now-playing";
import LikeButton from "@/components/party/like-button";
import SearchTracks from "@/components/party/search-tracks";
import type { TrackMock } from "@/app/party/[partyId]/search-actions";
import SharePanel from "@/components/party/share-panel";
import { useToast } from "@/components/ui/toast-provider";
import { likeCurrentTrackAction, getLikeCountAction } from "@/app/party/[partyId]/track-actions";

export default function RoomClient({ partyId }: { partyId: string }) {
  const [queue, setQueue] = useState<TrackMock[]>([]);
  const [current, setCurrent] = useState<TrackMock | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);
  const toast = useToast();
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  // ホストモード: ローカルストレージで保持（疑似的な権限切り替え）
  useEffect(() => {
    try {
      const key = `host:${partyId}`;
      const saved = localStorage.getItem(key);
      if (saved === "1") setIsHost(true);
    } catch {
      // ignore
    }
  }, [partyId]);

  const toggleHost = () => {
    setIsHost((prev) => {
      const next = !prev;
      try {
        const key = `host:${partyId}`;
        if (next) localStorage.setItem(key, "1");
        else localStorage.removeItem(key);
      } catch {
        // ignore
      }
      return next;
    });
  };

  const onAdd = (t: TrackMock) => {
    let added = false;
    setQueue((prev) => {
      if (prev.some((p) => p.id === t.id)) return prev;
      if (current && current.id === t.id) return prev;
      added = true;
      return [...prev, t];
    });
    if (added) toast.show("キューに追加しました", { type: "success" });
    else toast.show("すでに追加されています", { type: "info" });
  };

  const startPlayback = () => {
    setQueue((prev) => {
      if (prev.length === 0) return prev;
      const [head, ...rest] = prev;
      setCurrent(head);
      setLiked(false);
      setLikeCount(0);
      return rest;
    });
  };

  const nextTrack = () => {
    setQueue((prev) => {
      if (prev.length === 0) {
        setCurrent(null);
        setLiked(false);
        setLikeCount(0);
        return prev;
      }
      const [head, ...rest] = prev;
      setCurrent(head);
      setLiked(false);
      setLikeCount(0);
      return rest;
    });
  };

  // Fetch initial like count from DB when current track changes
  useEffect(() => {
    const run = async () => {
      if (!current) return;
      const res = await getLikeCountAction({ partyCode: partyId, trackId: current.id });
      if (res.ok) setLikeCount(res.total);
      else if (res.error === "NO_DB") setLikeCount(0);
      else setLikeCount(0);
    };
    run();
  }, [current, partyId]);

  const hasQueue = queue.length > 0;
  const queueCount = queue.length;

  return (
    <>
      <section className="rounded-lg border border-foreground/15 p-4">
        <div className="flex items-center gap-3">
          <h2 className="font-medium">表示モード</h2>
          <div className="ml-auto flex items-center gap-2">
            <label className="text-sm opacity-80">参加者</label>
            <button
              type="button"
              onClick={toggleHost}
              className={`relative inline-flex h-6 w-11 items-center rounded-full border border-foreground/20 transition-colors ${
                isHost ? "bg-[#1DB954]" : "bg-transparent"
              }`}
              aria-pressed={isHost}
              aria-label="ホストモード切り替え"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-current text-transparent transition-transform ${
                  isHost ? "translate-x-5" : "translate-x-1"
                }`}
              >
                .
              </span>
            </button>
            <label className="text-sm opacity-80">ホスト</label>
          </div>
        </div>
        <p className="mt-2 text-xs opacity-70">
          デモ用のUI切り替えです。実際の権限判定は後で実装します。
        </p>
      </section>

      {isHost && <SharePanel partyId={partyId} />}

      {current ? (
        <NowPlaying
          title={current.title}
          artist={current.artist}
          album={current.album}
          imageUrl={current.imageUrl}
        />
      ) : (
        <section className="rounded-lg border border-foreground/15 p-4">
          <h2 className="font-medium mb-2">再生中</h2>
          <div className="opacity-70 text-sm">再生中の曲はありません。</div>
        </section>
      )}

      {current && (
        <LikeButton
          key={`like-${current.id}`}
          trackId={current.id}
          initialCount={likeCount}
          disabled={liked}
          onLike={async () => {
            if (!current) return null;
            const res = await likeCurrentTrackAction({ partyCode: partyId, trackId: current.id });
            if (res.ok) {
              setLiked(true);
              return { total: res.total, liked: true };
            }
            if (res.error === "NO_DB") {
              toast.show("DB未接続のためローカルカウントで処理しました", { type: "info" });
              return null;
            }
            if (res.error === "UNAUTHENTICATED") {
              toast.show("ログインが必要です", { type: "error" });
              return null;
            }
            if (res.error === "NOT_FOUND") {
              toast.show("パーティーが見つかりません", { type: "error" });
              return null;
            }
            toast.show("エラーが発生しました", { type: "error" });
            return null;
          }}
        />
      )}

      {isHost && (
        <div className="flex gap-2">
          {!current && hasQueue && (
            <button
              type="button"
              onClick={startPlayback}
              className="rounded-md bg-foreground text-background px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              再生開始
            </button>
          )}
          {current && (
            <button
              type="button"
              onClick={nextTrack}
              className="rounded-md border border-foreground/20 px-4 py-2 hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              次の曲へ
            </button>
          )}
        </div>
      )}

      <SearchTracks
        partyId={partyId}
        onAdd={onAdd}
        existingIds={[...(current ? [current.id] : []), ...queue.map((q) => q.id)]}
      />

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
                  onClick={() => {
                    setQueue((prev) => prev.filter((p) => p.id !== t.id));
                    toast.show("キューから削除しました", { type: "info" });
                  }}
                  className="text-xs rounded-md border border-foreground/20 px-2 py-1 hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
