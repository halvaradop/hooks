"use client"
import { useEffect, useRef } from "react"
import type { UseInterval } from "@/types"

/**
 * `useInterval` is a custom hook that sets up an interval to call a callback function at specified intervals.
 *
 * @param {VoidFunction} callback - The function to be called at each interval.
 * @param {number | undefined | null} delay - The interval delay in milliseconds. If null, the interval is not set.
 * @example
 * const MyComponent = () => {
 *   useInterval(() => {
 *     console.log("This will run every 1000ms");
 *   }, 1000);
 * }
 *
 * const MyComponentWithNoDelay = () => {
 *   const [isActive, setIsActive] = useState(true);
 *   useInterval(() => {
 *     console.log("This will run every 1000ms only if isActive is true");
 *   }, isActive ? 1000 : null);
 * }
 */
export const useInterval: UseInterval = (callback, delay): void => {
    const callbackRef = useRef<VoidFunction>(callback)

    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    useEffect(() => {
        if (delay === undefined || delay === null || Number.isNaN(delay) || delay === 0) return

        const idle = setInterval(() => {
            callbackRef.current()
        }, delay)

        return () => {
            clearInterval(idle)
        }
    }, [delay])
}
