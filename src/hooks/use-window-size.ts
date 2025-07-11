import { useState, useLayoutEffect } from "react"
import type { WindowSize } from "@/types/hook-types"

/**
 * Gets the current window size of the browser window giving the width and height values,
 * this values are updated on resize events.
 *
 * @returns {WindowSize} - The current window size.
 * @example
 * const MyComponent = () => {
 *   const { width, height } = useWindowSize();
 *
 *   // Use width and height to render responsive components or styles
 *   return (
 *     <div>
 *       <p>Width: {width}px</p>
 *       <p>Height: {height}px</p>
 *     </div>
 *   )
 * }
 */
export const useWindowSize = (): WindowSize => {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: 0,
        height: 0,
    })

    useLayoutEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        handleResize()
        document.addEventListener("resize", handleResize)

        return () => document.removeEventListener("resize", handleResize)
    }, [])

    return windowSize
}
