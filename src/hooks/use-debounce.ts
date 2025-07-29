import { useEffect, useState } from "react"

/**
 * `useDebounce` is a React hook that debounces a value, returning the debounced value after a specified delay.
 *
 * @param {T} value - The value to debounce
 * @param {number | null} delay - The debounce delay in milliseconds. If null,
 * @returns {T} - The debounced value
 * @example
 * const MyComponent = () => {
 *   const [searchTerm, setSearchTerm] = useState("");
 *   const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 *   useEffect(() => {
 *     // Perform search with debounced value
 *     console.log("Searching for:", debouncedSearchTerm);
 *   }, [debouncedSearchTerm]);
 *
 *  return (
 *    <input
 *      type="text"
 *      value={searchTerm}
 *      onChange={(e) => setSearchTerm(e.target.value)}
 *    />
 *  );
 * };
 */
export const useDebounce = <T>(value: T, delay?: number | null) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        if (!delay) return
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}
