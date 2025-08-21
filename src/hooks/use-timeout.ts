"use client"
import type { UseTimeout } from "@/types"
import { useEffect, useRef } from "react"

/**
 * `useTimeout` is a custom hook that runs a callback after the provided milliseconds.
 *
 * @param {VoidFunction} callback - The function to be called after the delay
 * @param {number | undefined | null} delay - The delay in milliseconds. If null, the timeout is not set.
 * @example
 * const MyComponent = () => {
 *   useTimeout(() => {
 *     console.log("Timeout executed");
 *   }, 1000);
 * }
 */
export const useTimeout: UseTimeout = (callback, delay) => {
    const callbackRef = useRef<VoidFunction>(callback)

    useEffect(() => {
        const defaultTime = delay ?? 0
        const idle = setTimeout(callbackRef.current, defaultTime)

        return () => {
            clearTimeout(idle)
        }
    }, [delay])
}
