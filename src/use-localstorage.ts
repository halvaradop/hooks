"use client"
import { useState, useCallback, useEffect } from "react"

export const defaultSerializer = {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
}

interface UseLocalStorageOptions<T> {
    serializer?: {
        serialize: (value: T) => string
        deserialize: (value: string) => T
    }
    withEvent?: boolean
}

interface UseLocalStorageReturn<T> {
    storage: T | undefined
    setValue: (value: T | ((previous: undefined | T) => T)) => void
    removeItem: () => void
}

export const useLocalStorage = <T>(key: string, initialValue?: T, options: UseLocalStorageOptions<T> = {}) => {
    const [storage, setStorage] = useState<T | undefined>(initialValue)

    const { withEvent = false, serializer = defaultSerializer } = options
    const { serialize, deserialize } = serializer

    const isBrowser = useCallback((): boolean => {
        return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
    }, [])

    const setValue: UseLocalStorageReturn<T>["setValue"] = useCallback(
        (value) => {
            if (!isBrowser()) return
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
        if (!isBrowser()) return
        const getItem = localStorage.getItem(key)
        const storageValue = getItem ? deserialize(getItem) : initialValue
        localStorage.setItem(key, serialize(storageValue))
        setStorage(storageValue)
        return storageValue
    }, [key, initialValue, serializer])

    const removeItem: UseLocalStorageReturn<T>["removeItem"] = useCallback(() => {
        setStorage(() => undefined)
        localStorage.removeItem(key)
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
