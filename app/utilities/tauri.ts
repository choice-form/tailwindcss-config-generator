import { useEffect, useState } from "react"

declare global {
  interface Window {
    __TAURI__: any
  }
}

export const isTauriApp = () => {
  if (typeof window !== "undefined") {
    return window?.__TAURI__ !== undefined
  }

  return undefined
}

