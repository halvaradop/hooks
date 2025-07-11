"use client"
import { useState, useEffect, useCallback } from "react"
import { useWindowEventListener } from "@/hooks/use-window-event-listener"

/**
 * `useOnlineStatus` is a React hook that provides the online status of the browser.
 * It listens to the `online` and `offline` events to update the status.
 *
 * @returns {boolean} - Returns the online status of the browser.
 * @example
 * const MyComponent = () => {
 *   const isOnline = useOnlineStatus();
 *
 *   // Use isOnline to conditionally render components or show messages
 *   if (isOnline) {
 *     console.log("You are online");
 *   } else {
 *     console.log("You are offline");
 *   }
 * }
 */
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
