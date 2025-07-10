"use client"
import { useState, useCallback, useEffect } from "react"
import { useWindowEventListener } from "@/use-window-event-listener"

/**
 * Default serializer for `useLocalStorage` hook
 */
export const defaultSerializer = {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
}

/**
 * Options for the third argument of `useLocalStorage` hook
 * - `serializer`: Custom serializer for the value stored in localStorage.
 * - `withEvent`: If true, the hook will listen to the `storage` event
 *   to synchronize the value across different tabs or windows.
 *   This is useful when the localStorage is modified in another tab.
 */
interface UseLocalStorageOptions<T> {
    serializer?: {
        serialize: (value: T) => string
        deserialize: (value: string) => T
    }
    withEvent?: boolean
}

/**
 * Return type of `useLocalStorage` hook
 * - `storage`: The current value stored in localStorage.
 * - `setValue`: Function to set a new value in localStorage.
 * - `removeItem`: Function to remove the item from localStorage.
 */
interface UseLocalStorageReturn<T> {
    storage: T | undefined
    setValue: (value: T | ((previous: undefined | T) => T)) => void
    removeItem: () => void
}

/**
 * `useLocalStorage` is a React hook that provides a way to manage state synchronized with the browser's localStorage.
 * It allows you to set, get, and remove items from localStorage while keeping the state in sync with the stored value.
 *
 * @param {string} key - The key under which the value is stored in localStorage.
 * @param {T} initialValue - The initial value to be stored in localStorage. If not provided, it defaults to `undefined`.
 * @param {UseLocalStorageOptions<T>} options - Options for customizing the behavior of the hook.
 * @example
 * const [value, setValue, removeItem] = useLocalStorage("myKey", "defaultValue", {
 *     withEvent: true,
 *     serializer: {
 *         serialize: (value) => JSON.stringify(value),
 *         deserialize: (value) => JSON.parse(value),
 *     },
 * });
 *
 * // Sets the value in localStorage and updates the state
 * setValue("newValue");
 *
 * // Removes the item from localStorage and updates the state
 * removeItem();
 */
export const useLocalStorage = <T>(key: string, initialValue?: T, options: UseLocalStorageOptions<T> = {}) => {
    const [storage, setStorage] = useState<T | undefined>(initialValue)

    const { withEvent = false, serializer = defaultSerializer } = options
    const { serialize, deserialize } = serializer
    const isSupported = typeof window !== "undefined" && typeof localStorage !== "undefined"

    const setValue: UseLocalStorageReturn<T>["setValue"] = useCallback(
        (value) => {
            if (!isSupported) return
            setStorage((previous) => {
                const valueToStore = value instanceof Function ? value(previous) : value
                const storageValue = serialize(valueToStore)
                localStorage.setItem(key, storageValue)
                return valueToStore
            })
        },
        [key, serializer],
    )

    const getStorage = useCallback(() => {
        if (!isSupported) return
        const getItem = localStorage.getItem(key)
        const storageValue = getItem ? deserialize(getItem) : initialValue
        localStorage.setItem(key, serialize(storageValue))
        setStorage(storageValue)
        return storageValue
    }, [key, initialValue, serializer])

    const removeItem: UseLocalStorageReturn<T>["removeItem"] = useCallback(() => {
        setStorage(() => undefined)
        localStorage.removeItem(key)
    }, [key, isSupported])

    useEffect(() => {
        getStorage()
    }, [key, serializer])

    useWindowEventListener(
        "storage",
        (event: StorageEvent) => {
            const { key, newValue } = event
            if (event.key === key) {
                const newContextValue = newValue ? deserialize(newValue) : undefined
                setStorage(newContextValue)
            }
        },
        { deps: [serializer, key, withEvent, isSupported], enabled: withEvent && isSupported },
    )

    return [storage, setValue, removeItem] as const
}
