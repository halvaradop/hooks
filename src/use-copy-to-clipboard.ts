"use client"
import { useCallback, useState } from "react"

interface UseCopyToClipboardReturn {
    copyText: string | undefined
    copyToClipboard: (text: string) => Promise<boolean>
}

/**
 * `useCopyToClipboard` is a React hook that provides functionality to copy text to the clipboard.
 * It returns the last copied text and a function to copy new text.
 *
 * @example
 * const [copyText, copyToClipboard] = useCopyToClipboard();
 *
 * // To copy text to clipboard
 * const handleCopy = async () => {
 *   const success = await copyToClipboard("Hello, World!");
 *   if (success) {
 *     console.log("Text copied to clipboard:", copyText);
 *   } else {
 *     console.error("Failed to copy text to clipboard");
 *   }
 * };
 */
export const useCopyToClipboard = () => {
    const [copyText, setCopyText] = useState<UseCopyToClipboardReturn["copyText"]>(undefined)

    const isSupported =
        typeof window !== "undefined" && typeof navigator !== "undefined" && typeof navigator.clipboard !== "undefined"

    const copyToClipboard: UseCopyToClipboardReturn["copyToClipboard"] = useCallback(
        async (text: string) => {
            if (!isSupported) return false
            try {
                await navigator.clipboard.writeText(text)
                setCopyText(text)
                return true
            } catch (error) {
                setCopyText(undefined)
                console.error("Failed to copy text to clipboard:", error)
                return false
            }
        },
        [isSupported],
    )

    return [copyText, copyToClipboard] as const
}
