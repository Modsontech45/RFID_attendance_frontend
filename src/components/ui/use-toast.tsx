"use client"

import * as React from "react"

type Toast = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastAction = Omit<Toast, "id">

const ToastContext = React.createContext<{
  toasts: Toast[]
  toast: (props: ToastAction) => void
  dismiss: (id: string) => void
} | null>(null)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = (props: ToastAction) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, ...props }])
    setTimeout(() => dismiss(id), 4000) // auto dismiss after 4s
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}
