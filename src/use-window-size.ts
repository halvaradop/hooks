import { useEffect, useState } from "react"

/**
 * Represents the size of the window with width and height properties.
 */
interface WindowSize {
    width: number
    height: number
}

/**
 * Gets the current window size of the browser window giving the width and height values,
 * this values are updated on resize events.
 *
 * @returns {WindowSize} - The current window size.
 * @example
 * const { width, height } = useWindowSize();
 */
export const useWindowSize = (): WindowSize => {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: 0,
        height: 0,
    })

    useEffect(() => {
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
