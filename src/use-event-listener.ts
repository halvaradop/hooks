import { type DependencyList, RefObject, useEffect, useRef } from "react"

/**
 * Represents the target element to which the event listener will be attached.
 * This can be a `Window`, `Document`, or any `HTMLElement`.
 */
type EventTarget = Window | Document | HTMLElement

/**
 * Maps event types to their corresponding event objects for different event sources.
 */
type EventMap<EventSource> = EventSource extends Window
    ? WindowEventMap
    : EventSource extends Document
      ? DocumentEventMap
      : EventSource extends HTMLElement
        ? HTMLElementEventMap
        : Record<string, Event>

/**
 * Options for the event listener, which can include `capture`, `once`, `passive`, and `deps`.
 */
export interface EventListenerOptions {
    options?: boolean | AddEventListenerOptions
    deps?: DependencyList
}

type TargetRef<T> = T | (() => T) | RefObject<T>

/**
 * Resolves the target element from the provided input.
 *
 * @param {EventTarget | (() => EventTarget) | RefObject<EventTarget>} target - The target element to which the event listener will be attached. This can be a `Window`, `Document`, or any `HTMLElement`. It can also be a function that returns the target or a React ref object.
 * @returns {EventTarget} - Returns the resolved target element. If the target is a function, it calls the function to get the target. If it's a ref object, it returns the `current` property of the ref. Otherwise, it returns the target directly.
 */
const getTarget = (target: EventTarget | (() => EventTarget) | RefObject<EventTarget>): EventTarget => {
    if (target instanceof Function) {
        return target()
    }
    return "current" in target ? target.current : target
}

/**
 * `useEventListener` is a React hook that allows you to add an event listener to a target element.
 *
 * @param {EventTarget} target - The target element to which the event listener will be attached. This can be a `Window`, `Document`, or any `HTMLElement`.
 * @param {keyof EventMap<EventTarget>} type - The type of event to listen for, such as `"click"`, `"keydown"`, etc. This should be a key of the `EventMap` corresponding to the target.
 * @param {EventMap<EventTarget>} event - The event handler function that will be called when the event occurs. It receives the event object as its argument.
 * @param {EventListenerOptions} options - Optional configuration for the event listener. It can include options like `capture`, `once`, `passive`, and `signal`. The `deps` property can be used to specify dependencies for the effect.
 * @example
 * const MyComponent = () => {
 *  const handleClick = (event) => {
 *      console.log("Element clicked:", event.target);
 *  };
 *
 *  useEventListener(document, "click", handleClick)
 * }
 */
export const useEventListener = <T extends EventTarget, K extends keyof EventMap<T>>(
    target: TargetRef<T>,
    type: K,
    event: (this: T, ev: EventMap<T>[K]) => any,
    options: EventListenerOptions = {},
) => {
    const callbackRef = useRef<Function>(event)
    const { options: eventOptions } = options
    const isSupported = typeof window !== "undefined" && typeof target !== "undefined"
    const resolvedTarget = getTarget(target)

    useEffect(() => {
        callbackRef.current = event
    }, [event])

    useEffect(() => {
        if (!isSupported) return

        const eventListener = (ev: EventMap<T>[K]) => {
            callbackRef.current.call(resolvedTarget, ev)
        }

        resolvedTarget.addEventListener(type as string, eventListener as any, eventOptions)

        return () => resolvedTarget.removeEventListener(type as string, eventListener as any, eventOptions)
    }, [resolvedTarget, type, eventOptions])
}
