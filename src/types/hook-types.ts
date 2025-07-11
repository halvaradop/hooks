/**
 * Return type for the `useBroadcastChannel` hook.
 * It includes the current state, a function to send messages, a function to close the channel, and a boolean
 * indicating if the BroadcastChannel API is supported.
 */
export type BroadcastChannelReturn<T> = readonly [message: T | undefined, (message: T) => void, VoidFunction, boolean]

/**
 * Return type for the `useCopyToClipboard` hook.
 * It includes the copied text and a function to copy text to the clipboard.
 */
export type UseCopyToClipboardReturn = readonly [copyText: string | undefined, (text: string) => Promise<boolean>]

/**
 * Type definition for the `useInterval` hook.
 * It takes a callback function and an optional delay in milliseconds.
 */
export type UseInterval = (callback: VoidFunction, delay?: number | null) => void

/**
 * Type definition for the `useToggle` hook.
 * It takes an optional initial value (default is `false`) and returns a tuple:
 * - The first element is the current value (boolean).
 * - The second element is a function to toggle the value.
 */
export type UseToggle = (initialValue?: boolean) => readonly [value: boolean, (value?: boolean) => void]

/**
 * Represents the size of the window with width and height properties.
 */
export interface WindowSize {
    width: number
    height: number
}
