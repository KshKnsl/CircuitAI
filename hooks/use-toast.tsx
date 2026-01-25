"use client"

import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive" | "success"
  duration?: number
}

const toast = (title: string, props?: Omit<ToastProps, "title">) => {
  return sonnerToast(title, {
    ...props,
  })
}

export function useToast() {
  return {
    toast,
    // Exposing other sonner methods for compatibility
    error: (title: string, description?: string) => sonnerToast.error(title, { description }),
    success: (title: string, description?: string) => sonnerToast.success(title, { description }),
    info: (title: string, description?: string) => sonnerToast.info(title, { description }),
    warning: (title: string, description?: string) => sonnerToast.warning(title, { description }),
    dismiss: () => sonnerToast.dismiss()
  }
}