"use client"
import { useEffect, useRef } from "react"

export const useInterval = (callback: VoidFunction, delay: number | null) => {
    const callbackRef = useRef<VoidFunction>(callback)

    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    useEffect(() => {
        if (!delay) return

        const idle = setInterval(() => {
            callbackRef.current()
        }, delay)

        return () => {
            clearInterval(idle)
        }
    }, [delay])
}
