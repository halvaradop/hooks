import { useEventListener, type EventListenerOptions } from "@/use-event-listener"

/**
 * `useWindowEventListener` is a React hook that provides a convenient way to add event listeners to the window object.
 * It's a specialized wrapper around `useEventListener` that automatically targets the window.
 *
 * This hook is ideal for listening to global window events like resize, scroll, focus/blur,
 * online/offline status, and other window-level events.
 *
 * @param {K} type - The type of window event to listen for (e.g., 'resize', 'scroll', 'focus', 'blur', 'online', 'offline')
 * @param {(this: Window, ev: WindowEventMap[K]) => any} event - The event handler function that will be called when the event occurs
 * @param {EventListenerOptions} [options] - Optional configuration for the event listener including capture, once, passive options and custom dependencies
 * @example
 * // Listen for window resize events
 * useWindowEventListener('resize', () => {
 *   const { innerWidth, innerHeight } = window
 *   setWindowSize({ width: innerWidth, height: innerHeight })
 * })
 *
 * // Listen for online/offline status
 * useWindowEventListener('online', () => {
 *   setIsOnline(true)
 *   showNotification('Connection restored')
 * })
 *
 * useWindowEventListener('offline', () => {
 *   setIsOnline(false)
 *   showNotification('Connection lost')
 * })
 *
 * // Listen for window focus/blur for pause/resume functionality
 * useWindowEventListener('focus', () => {
 *   setIsWindowFocused(true)
 *   resumeTimers()
 * })
 *
 * useWindowEventListener('blur', () => {
 *   setIsWindowFocused(false)
 *   pauseTimers()
 * })
 *
 * // Listen for beforeunload to warn about unsaved changes
 * useWindowEventListener('beforeunload', (event) => {
 *   if (hasUnsavedChanges) {
 *     event.preventDefault()
 *     event.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
 *     return event.returnValue
 *   }
 * }, { deps: [hasUnsavedChanges] })
 *
 * // Listen for scroll with passive option for performance
 * useWindowEventListener('scroll',
 *   useCallback(throttle(() => {
 *     const scrollY = window.scrollY
 *     setShowBackToTop(scrollY > 500)
 *   }, 100), []),
 *   { options: { passive: true } }
 * )
 */
export const useWindowEventListener = <K extends keyof WindowEventMap>(
    type: K,
    event: (this: Window, ev: WindowEventMap[K]) => any,
    options?: EventListenerOptions,
) => {
    const isSupported = typeof window !== "undefined" && typeof window.addEventListener === "function"
    if (!isSupported) return () => {}
    return useEventListener(window, type, event, options)
}
