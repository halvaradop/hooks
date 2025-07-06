"use client"
import { useState, useEffect } from "react"

export const useLocalStorage = <T>(key: string, initialValue?: T) => {
    const [storage, setStorage] = useState<T>()

    const setValue = (value: T | ((previous: undefined | T) => T)) => {
        const valueToStore = value instanceof Function ? value(storage) : value
        const storageValue = JSON.stringify(valueToStore)
        setStorage(valueToStore)
        localStorage.setItem(key, storageValue)
    }

    const getStorage = () => {
        const getItem = localStorage.getItem(key)
        const storageValue = getItem ? JSON.parse(getItem) : initialValue
        setStorage(storageValue)
        localStorage.setItem(key, JSON.stringify(storageValue))
    }

    useEffect(() => {
        getStorage()
    }, [])

    return [storage, setValue] as const
}
