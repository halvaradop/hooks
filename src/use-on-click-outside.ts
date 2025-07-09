import type { RefObject } from "react"
import { useDocumentEventListener } from "./use-document-event-listener"

export const useOnClickOutside = <T extends HTMLElement>(target: RefObject<T>, handler: (event: MouseEvent) => void) => {
    const handleClickOutside = (event: MouseEvent) => {
        if (target.current && !target.current.contains(event.target as Node)) {
            handler(event)
        }
    }

    useDocumentEventListener("click", handleClickOutside, { deps: [target] })
}
