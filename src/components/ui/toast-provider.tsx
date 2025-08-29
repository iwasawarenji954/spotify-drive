"use client";

import { createContext, use, useCallback, useMemo, useState } from "react";

type Toast = {
  id: number;
  message: string;
  type?: "info" | "success" | "error";
};

type ToastContextValue = {
  show: (message: string, opts?: { type?: Toast["type"]; duration?: number }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = use(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback(
    (message: string, opts?: { type?: Toast["type"]; duration?: number }) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      const toast: Toast = { id, message, type: opts?.type };
      setToasts((prev) => [...prev, toast]);
      const duration = Math.max(800, Math.min(8000, opts?.duration ?? 2000));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center">
        <div className="flex flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={
                "pointer-events-auto rounded-md px-3 py-2 text-sm shadow-md border " +
                (t.type === "success"
                  ? "bg-[#1DB954] text-white border-transparent"
                  : t.type === "error"
                  ? "bg-red-600 text-white border-transparent"
                  : "bg-foreground/90 text-background border-foreground/10")
              }
              role="status"
              aria-live="polite"
            >
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </ToastContext>
  );
}

