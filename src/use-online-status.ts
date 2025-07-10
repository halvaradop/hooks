"use client"
import { useCallback, useEffect, useState } from "react"
import { useWindowEventListener } from "@/use-window-event-listener"

export const useOnlineStatus = () => {
    const isSupported = typeof window !== "undefined" && typeof window.navigator !== "undefined"
    const [isOnline, setIsOnline] = useState(false)

    const updateOnlineStatus = useCallback(() => {
        if (!isSupported) return
        setIsOnline(navigator.onLine)
    }, [isSupported])

    useEffect(() => {
        if (!isSupported) return
        updateOnlineStatus()
    }, [isSupported, updateOnlineStatus])

    useWindowEventListener("offline", updateOnlineStatus)
    useWindowEventListener("online", updateOnlineStatus)

    return isOnline
}
