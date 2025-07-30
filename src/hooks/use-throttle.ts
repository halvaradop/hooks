"use client"
import { useEffect, useRef, useState } from "react"

/**
 * `useThrottle` is a React hook that throttles a value, returning the throttled value after a specified delay.
 *
 * @param {T} value - The value to throttle
 * @param {number} delay - The delay in milliseconds
 * @returns The throttled value
 * @example
 * const MyComponent = () => {
 *   const [count, setCount] = useState(0);
 *   const throttledCount = useThrottle(count, 1000);
 *
 *   useEffect(() => {
 *     console.log("Throttled count:", throttledCount);
 *   }, [throttledCount]);
 *
 *  return (
 *    <button onClick={() => setCount(count + 1)}>
 *      Increment
 *    </button>
 *  );
 */
export const useThrottle = <T>(value: T, delay: number = 300) => {
    const [throttledValue, setThrottledValue] = useState<T>(value)
    const lastExecuted = useRef<number>(Date.now())
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const now = Date.now()
        const remaining = delay - (now - lastExecuted.current)

        if (remaining <= 0) {
            setThrottledValue(value)
            lastExecuted.current = now
        } else {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(() => {
                setThrottledValue(value)
                lastExecuted.current = Date.now()
            }, remaining)
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [value, delay])

    return throttledValue
}
