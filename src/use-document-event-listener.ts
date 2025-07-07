import { useEventListener, type EventListenerOptions } from "@/use-event-listener"

/**
 * `useDocumentEventListener` is a React hook that provides a convenient way to add event listeners to the document object.
 * It's a specialized wrapper around `useEventListener` that automatically targets the document.
 *
 * This hook is particularly useful for listening to global document events like keyboard shortcuts,
 * click events outside components, or document-wide state changes.
 *
 * @param {K} type - The type of document event to listen for (e.g., 'click', 'keydown', 'scroll', 'visibilitychange')
 * @param {(this: Document, ev: DocumentEventMap[K]) => any} event - The event handler function that will be called when the event occurs
 * @param {EventListenerOptions} [options] - Optional configuration for the event listener including capture, once, passive options and custom dependencies
 * @example
 * // Listen for clicks anywhere on the document
 * useDocumentEventListener('click', (event) => {
 *   console.log('Document clicked:', event.target)
 * })
 *
 * // Listen for keyboard shortcuts
 * useDocumentEventListener('keydown', (event) => {
 *   if (event.ctrlKey && event.key === 's') {
 *     event.preventDefault()
 *     handleSave()
 *   }
 * })
 *
 * // Listen for visibility changes with options
 * useDocumentEventListener('visibilitychange', () => {
 *   if (document.hidden) {
 *     pauseVideo()
 *   } else {
 *     resumeVideo()
 *   }
 * }, {
 *   options: { passive: true },
 *   deps: [pauseVideo, resumeVideo]
 * })
 *
 * // Listen for scroll events with throttling
 * useDocumentEventListener('scroll',
 *   useCallback(throttle(() => {
 *     updateScrollPosition(window.scrollY)
 *   }, 100), []),
 *   { options: { passive: true } }
 * )
 */
export const useDocumentEventListener = <K extends keyof DocumentEventMap>(
    type: K,
    event: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: EventListenerOptions,
) => {
    return useEventListener(document, type, event, options)
}
