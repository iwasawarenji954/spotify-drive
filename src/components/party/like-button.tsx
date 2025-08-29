"use client";

import { useState } from "react";

export default function LikeButton({
  initialCount = 0,
  trackId,
}: {
  initialCount?: number;
  trackId: string;
}) {
  const [count, setCount] = useState<number>(initialCount);
  const [clicked, setClicked] = useState<boolean>(false);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label={`トラック ${trackId} にいいね！`}
        onClick={() => {
          setCount((c) => c + 1);
          setClicked(true);
        }}
        className="rounded-full bg-[#1DB954] text-white px-6 py-3 font-medium hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1DB954]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        いいね！
      </button>
      <span className="text-sm opacity-80">
        {clicked ? "ありがとう！ " : ""}合計 {count} 件
      </span>
    </div>
  );
}
