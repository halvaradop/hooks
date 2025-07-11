"use client"
import { useState, useEffect, useRef, useCallback } from "react"

/**
 * Return type for the `useBroadcastChannel` hook.
 */
type BroadcastChannelReturn<T> = [T | undefined, (message: T) => void, VoidFunction, boolean]

/**
 * `useBroadcastChannel` is a React hook that provides a way to communicate between different tabs or windows of
 * the same origin using the BroadcastChannel API.
 *
 * @param {string} name - The name of the BroadcastChannel
 * @param {T} initialValue - The initial value to set in the channel
 * @returns {BroadcastChannelReturn<T>} - An array containing the current state and a function to send messages
 * @example
 * const [message, sendMessage] = useBroadcastChannel<string>("my-channel", "Hello World");
 */
export const useBroadcastChannel = <T>(name: string, initialValue?: T): BroadcastChannelReturn<T> => {
    const [state, setState] = useState<T | undefined>(initialValue)
    const broadcastChannel = useRef<BroadcastChannel | undefined>(undefined)
    const isSupported = typeof window !== "undefined" && "BroadcastChannel" in window

    const sendMessage = useCallback(
        async (message: T) => {
            if (!isSupported) return
            broadcastChannel.current?.postMessage(message)
            setState(message)
        },
        [name, isSupported],
    )

    const closeChannel = useCallback(() => {
        if (broadcastChannel.current) {
            broadcastChannel.current.close()
            broadcastChannel.current = undefined
            setState(undefined)
        }
    }, [])

    useEffect(() => {
        if (!isSupported) return
        broadcastChannel.current ??= new BroadcastChannel(name)

        const handleBroadcastMessage = (event: MessageEvent) => {
            setState(event.data)
        }

        broadcastChannel.current.addEventListener("message", handleBroadcastMessage)

        return () => {
            broadcastChannel.current?.removeEventListener("message", handleBroadcastMessage)
            broadcastChannel.current?.close()
            setState(undefined)
        }
    }, [])

    return [state, sendMessage, closeChannel, isSupported]
}
