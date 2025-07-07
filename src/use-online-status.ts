"use client"
import { useEffect, useState } from "react"

export const useOnlineStatus = () => {
    const [isOnline, setIsOnline] = useState(true)

    useEffect(() => {
        const updateOnlineStatus = () => {
            setIsOnline(navigator.onLine)
        }

        updateOnlineStatus()
        window.addEventListener("online", updateOnlineStatus)
        window.addEventListener("offline", updateOnlineStatus)

        return () => {
            window.removeEventListener("online", updateOnlineStatus)
            window.removeEventListener("offline", updateOnlineStatus)
        }
    }, [])

    return isOnline
}
