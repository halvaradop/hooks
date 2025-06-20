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

export type MediaDimension = "width" | "height"

export type MediaMinConstraint = "min-width" | "min-height"

export type MediaMaxConstraint = "max-width" | "max-height"

export type MediaConstraint = MediaDimension | MediaMinConstraint | MediaMaxConstraint

export type MediaComparator = ">" | "<" | ">=" | "<=" | ":"
