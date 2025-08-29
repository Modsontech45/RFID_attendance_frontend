"use client"

import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-lg p-4 shadow-lg text-sm w-80 ${
            t.variant === "destructive"
              ? "bg-red-600 text-white"
              : "bg-gray-900 text-white"
          }`}
        >
          {t.title && <p className="font-bold">{t.title}</p>}
          {t.description && <p className="text-gray-200">{t.description}</p>}
          <button
            onClick={() => dismiss(t.id)}
            className="absolute top-2 right-2 text-xs"
          >
            ✖
          </button>
        </div>
      ))}
    </div>
  )
}
