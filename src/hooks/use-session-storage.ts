"use client"
import { useState, useEffect, useCallback } from "react"
import { useWindowEventListener } from "@/hooks/use-window-event-listener"
import type { StorageSerializer, UseSessionStorageReturn, UseStorageOptions } from "@/types/storage-types"

/**
 * Default JSON serializer implementation for storage hooks
 */
const defaultSerializer: StorageSerializer<any> = {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
}

/**
 * `useSessionStorage` is a React hook that provides a way to manage state synchronized with the browser's sessionStorage.
 * It allows you to set, get, and remove items from sessionStorage while keeping the state in sync with the stored value.
 *
 * @param {string} key - The key under which the value is stored in sessionStorage.
 * @param {T} initialValue - The initial value to be stored in sessionStorage. If not provided, it defaults to `undefined`.
 * @param {UseStorageOptions<T>} options - Options for customizing the behavior of the hook.
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
export const useSessionStorage = <T>(
    key: string,
    initialValue?: T,
    options: UseStorageOptions<T> = {},
): UseSessionStorageReturn<T> => {
    const [storage, setStorage] = useState<T | undefined>(initialValue)

    const { withEvent = false, serializer = defaultSerializer } = options
    const { serialize, deserialize } = serializer
    const isSupported = typeof window !== "undefined" && typeof sessionStorage !== "undefined"

    const setValue = useCallback(
        (value: T | ((previous: undefined | T) => T)) => {
            if (!isSupported) return
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
        if (!isSupported) return
        const getItem = sessionStorage.getItem(key)
        const storageValue = getItem ? deserialize(getItem) : initialValue
        sessionStorage.setItem(key, serialize(storageValue))
        setStorage(storageValue)
        return storageValue
    }, [key, initialValue, serializer])

    const removeItem = useCallback(() => {
        setStorage(() => undefined)
        sessionStorage.removeItem(key)
    }, [key, isSupported])

    const handlestorage = useCallback(
        (event: StorageEvent) => {
            const { key, newValue } = event
            if (event.key === key) {
                const newContextValue = newValue ? deserialize(newValue) : undefined
                setStorage(newContextValue)
            }
        },
        [key, deserialize],
    )

    useEffect(() => {
        getStorage()
    }, [key, serializer])

    useWindowEventListener("storage", handlestorage, {
        deps: [serializer, key, withEvent, isSupported],
        enabled: withEvent && isSupported,
    })

    return [storage, setValue, removeItem]
}
