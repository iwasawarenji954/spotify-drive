"use client";

import { useMemo } from "react";
import { useToast } from "@/components/ui/toast-provider";

export default function SharePanel({ partyId }: { partyId: string }) {
  const shareUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/party/${partyId}`;
    }
    const base = process.env.NEXT_PUBLIC_APP_URL;
    return base ? `${base.replace(/\/$/, "")}/party/${partyId}` : `/party/${partyId}`;
  }, [partyId]);

  const toast = useToast();

  async function copy(text: string, kind: "code" | "url") {
    try {
      await navigator.clipboard.writeText(text);
      toast.show(kind === "code" ? "参加コードをコピーしました" : "共有URLをコピーしました", { type: "success" });
    } catch (_) {
      toast.show("コピーに失敗しました", { type: "error" });
    }
  }

  return (
    <section className="rounded-lg border border-foreground/15 p-4">
      <h2 className="font-medium mb-3">共有（ホスト向け・モック）</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <span className="text-sm opacity-70">参加コード:</span>
          <code className="px-2 py-1 rounded bg-foreground/10 text-sm font-mono">
            {partyId}
          </code>
          <button
            type="button"
            onClick={() => copy(partyId, "code")}
            className="ml-auto rounded-md border border-foreground/20 px-2 py-1 text-xs hover:bg-foreground/10"
          >
            コピー
          </button>
          
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm opacity-70">共有URL:</span>
          <span className="truncate text-sm" title={shareUrl}>
            {shareUrl}
          </span>
          <button
            type="button"
            onClick={() => copy(shareUrl, "url")}
            className="ml-auto rounded-md border border-foreground/20 px-2 py-1 text-xs hover:bg-foreground/10"
          >
            コピー
          </button>
          
        </div>
      </div>
      <p className="mt-2 text-xs opacity-70">
        実際のホスト判定や公開設定は後で実装します（UIのみ）。
      </p>
    </section>
  );
}
