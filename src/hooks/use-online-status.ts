"use client"
import { useState, useEffect, useCallback } from "react"
import { useWindowEventListener } from "@/hooks/use-window-event-listener"

export const useOnlineStatus = (): boolean => {
    const isSupported = typeof window !== "undefined" && typeof window.navigator !== "undefined"
    const [isOnline, setIsOnline] = useState(false)

    const handleOnlineStatus = useCallback(() => {
        if (!isSupported) return
        setIsOnline(navigator.onLine)
    }, [isSupported])

    useEffect(() => {
        if (!isSupported) return
        handleOnlineStatus()
    }, [isSupported, handleOnlineStatus])

    useWindowEventListener("offline", handleOnlineStatus)
    useWindowEventListener("online", handleOnlineStatus)

    return isOnline
}
