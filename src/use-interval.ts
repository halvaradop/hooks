"use client"
import { useEffect, useRef } from "react"

/**
 * `useInterval` is a custom hook that sets up an interval to call a callback function at specified intervals.
 *
 * @param {VoidFunction} callback - The function to be called at each interval.
 * @param {number | null} delay - The interval delay in milliseconds. If null, the interval is not set.
 * @example
 * useInterval(() => {
 *   console.log("This will run every 1000ms");
 * }, 1000);
 *
 * const [isActive, setIsActive] = useState(true);
 * useInterval(() => {
 *   console.log("This will run every 1000ms only if isActive is true");
 * }, isActive ? 1000 : null);
 */
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
