/**
 * Commonly used units with media queries in CSS:
 * - px (pixels)
 * - em (relative to the element's font size)
 * - rem (relative to the root font size)
 * - vw (percentage of the viewport's width)
 * - vh (percentage of the viewport's height)
 * - vmin (the smaller value between vw and vh)
 * - vmax (the larger value between vw and vh)
 */
export type MediaCSSUnit = "px" | "em" | "rem" | "vw" | "vh" | "vmin" | "vmax"

type MediaDimension = "width" | "height" | "min-width" | "min-height" | "max-width" | "max-height"

type MediaComparator = ">" | "<" | ">=" | "<=" | ":"

type Query = `${MediaDimension}${MediaComparator}${number}${MediaCSSUnit}`

/**
 * Type definition for media query strings used in the `useMediaQuery` hook.
 * Supports standard CSS media query syntax.
 */
export type MediaQuery = Query | `(${Query})`

/**
 * Type definition for the `useMediaQuery` hook.
 * It takes a media query string and returns a boolean indicating whether the query matches the current viewport.
 */
export type UseMediaQuery = (mediaQuery: MediaQuery) => boolean
