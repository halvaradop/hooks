import type { RefObject } from "react"
import { useDocumentEventListener } from "@/hooks/use-document-event-listener"

/**
 * `useOnClickOutside` is a React hook that listens for click events outside of a specified target element.
 * It allows you to execute a callback function when a click occurs outside the target element.
 *
 * @param {RefObject<T>} target - A React ref object pointing to the target element.
 * @param {(e: MouseEvent) => void} handler - A function that will be called when a click occurs outside the target element.
 * @example
 * const MyComponent = () => {
 *   const ref = useRef<HTMLDivElement>(null);
 *
 *   const handleClickOutside = (event: MouseEvent) => {
 *      console.log("Clicked outside the target element");
 *   };
 *
 *   useOnClickOutside(ref, handleClickOutside);
 *   return <div ref={ref}>Click outside this element</div>;
 * }
 */
export const useOnClickOutside = <T extends HTMLElement>(target: RefObject<T>, handler: (event: MouseEvent) => void) => {
    const handleClickOutside = (event: MouseEvent) => {
        if (!target.current.contains(event.target as Node)) {
            handler(event)
        }
    }

    useDocumentEventListener("click", handleClickOutside, { deps: [target] })
}
