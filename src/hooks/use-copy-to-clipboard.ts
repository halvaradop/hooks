"use client"
import { useState, useCallback } from "react"
import type { UseCopyToClipboardReturn } from "@/types/hook-types"

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
export const useCopyToClipboard = (): UseCopyToClipboardReturn => {
    const [copyText, setCopyText] = useState<string | undefined>(undefined)

    const isSupported =
        typeof window !== "undefined" && typeof navigator !== "undefined" && typeof navigator.clipboard !== "undefined"

    const copyToClipboard = useCallback(
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

    return [copyText, copyToClipboard]
}
