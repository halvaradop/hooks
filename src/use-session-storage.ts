"use client"
import { useState, useCallback, useEffect } from "react"
/**
 * Default serializer for `useSessionStorage` hook
 */
export const defaultSerializer = {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
}

/**
 * Options for the third argument of `useSessionStorage` hook
 * - `serializer`: Custom serializer for the value stored in sessionStorage.
 * - `withEvent`: If true, the hook will listen to the `storage` event
 *   to synchronize the value across different tabs or windows.
 *   This is useful when the sessionStorage is modified in another tab.
 */
interface UseSessionStorageOptions<T> {
    serializer?: {
        serialize: (value: T) => string
        deserialize: (value: string) => T
    }
    withEvent?: boolean
}

/**
 * Return type of `useSessionStorage` hook
 * - `storage`: The current value stored in sessionStorage.
 * - `setValue`: Function to set a new value in sessionStorage.
 * - `removeItem`: Function to remove the item from sessionStorage.
 */
interface UseSessionStorageReturn<T> {
    storage: T | undefined
    setValue: (value: T | ((previous: undefined | T) => T)) => void
    removeItem: () => void
}

/**
 * `useSessionStorage` is a React hook that provides a way to manage state synchronized with the browser's sessionStorage.
 * It allows you to set, get, and remove items from sessionStorage while keeping the state in sync with the stored value.
 *
 * @param {string} key - The key under which the value is stored in sessionStorage.
 * @param {T} initialValue - The initial value to be stored in sessionStorage. If not provided, it defaults to `undefined`.
 * @param {UseSessionStorageOptions<T>} options - Options for customizing the behavior of the hook.
 * @example
 * const [value, setValue, removeItem] = useSessionStorage("myKey", "defaultValue", {
 *     withEvent: true,
 *     serializer: {
 *         serialize: (value) => JSON.stringify(value),
 *         deserialize: (value) => JSON.parse(value),
 *     },
 * });
 *
 * // Sets the value in sessionStorage and updates the state
 * setValue("newValue");
 *
 * // Removes the item from sessionStorage and updates the state
 * removeItem();
 */
export const useSessionStorage = <T>(key: string, initialValue?: T, options: UseSessionStorageOptions<T> = {}) => {
    const [storage, setStorage] = useState<T | undefined>(initialValue)

    const { withEvent = false, serializer = defaultSerializer } = options
    const { serialize, deserialize } = serializer

    const isBrowser = useCallback((): boolean => {
        return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined"
    }, [])

    const setValue: UseSessionStorageReturn<T>["setValue"] = useCallback(
        (value) => {
            if (!isBrowser()) return
            setStorage((previous) => {
                const valueToStore = value instanceof Function ? value(previous) : value
                const storageValue = serialize(valueToStore)
                sessionStorage.setItem(key, storageValue)
                return valueToStore
            })
        },
        [key, serializer],
    )

    const getStorage = useCallback(() => {
        if (!isBrowser()) return
        const getItem = sessionStorage.getItem(key)
        const storageValue = getItem ? deserialize(getItem) : initialValue
        sessionStorage.setItem(key, serialize(storageValue))
        setStorage(storageValue)
        return storageValue
    }, [key, initialValue, serializer])

    const removeItem: UseSessionStorageReturn<T>["removeItem"] = useCallback(() => {
        setStorage(() => undefined)
        sessionStorage.removeItem(key)
    }, [key, isBrowser])

    useEffect(() => {
        getStorage()
    }, [key, serializer])

    useEffect(() => {
        if (!withEvent || !isBrowser()) return

        const syncStorage = (event: StorageEvent) => {
            const { key, newValue } = event
            if (event.key === key) {
                const newContextValue = newValue ? deserialize(newValue) : undefined
                setStorage(newContextValue)
            }
        }

        window.addEventListener("storage", syncStorage)
        return () => window.removeEventListener("storage", syncStorage)
    }, [key, serializer, withEvent, isBrowser])

    return [storage, setValue, removeItem]
}
