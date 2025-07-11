/**
 * Default serializer interface for storage hooks
 */
export interface StorageSerializer<T> {
    serialize: (value: T) => string
    deserialize: (value: string) => T
}

/**
 * Options for the third argument of storage hooks
 * - `serializer`: Custom serializer for the value stored in storage.
 * - `withEvent`: If true, the hook will listen to the `storage` event
 *   to synchronize the value across different tabs or windows.
 */
export interface UseStorageOptions<T> {
    serializer?: StorageSerializer<T>
    withEvent?: boolean
}

/**
 * Return type of storage hooks
 * - First element: The current value stored in storage.
 * - Second element: Function to set a new value in storage.
 * - Third element: Function to remove the item from storage.
 */
type UseStorageReturn<T> = readonly [
    storage: T | undefined,
    setValue: (value: T | ((previous: undefined | T) => T)) => void,
    removeItem: () => void,
]

/**
 * Return type for the `useLocalStorage` hook.
 */
export type UseLocalStorageReturn<T> = UseStorageReturn<T>

/**
 * Return type for the `useSessionStorage` hook.
 */
export type UseSessionStorageReturn<T> = UseStorageReturn<T>
