"use client"
import { useEffect, useState } from "react"
import type { MediaComparator, MediaConstraint, MediaCSSUnit } from "./types.js"

type Query = `${MediaConstraint}${MediaComparator}${number}${MediaCSSUnit}`
export type MediaQuery = Query | `(${Query})`

/**
 * useMediaQuery is a React hook that determines if a given media query matches the current viewport.
 * It automatically updates the match status when the viewport changes.
 *
 * The `mediaQuery` parameter should be a valid media query string, such as:
 * - "(min-width: 600px)"
 * - "(max-width: 800px)"
 * - "(height: 900px)"
 *
 * Supported comparators: `>`, `<`, `=`, `>=`, `<=`
 * Supported constraints: `height`, `width`, `min-width`, `max-width`, `min-height`, `max-height`
 * Supported units: `px`, `em`, `rem`, `%`, `vw`, `vh`
 *
 * @param {MediaQuery} mediaQuery - The media query string to evaluate.
 * @returns {boolean} True if the media query matches the current viewport, otherwise false.
 *
 * @example
 * const isLargeScreen = useMediaQuery("(min-width: 1024px)");
 */
export const useMediaQuery = (mediaQuery: MediaQuery): boolean => {
    const [isMatched, setIsMatched] = useState(false)
    const isSupported = typeof window !== "undefined" && typeof mediaQuery === "string"

    useEffect(() => {
        if (!isSupported) return
        const mediaQueryList = window.matchMedia(mediaQuery)

        const handleMediaQuery = (event: MediaQueryListEvent) => {
            setIsMatched(event.matches)
        }

        setIsMatched(mediaQueryList.matches)
        mediaQueryList.addEventListener("change", handleMediaQuery)

        return () => mediaQueryList.removeEventListener("change", handleMediaQuery)
    }, [mediaQuery])

    return isMatched
}
