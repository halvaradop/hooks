import { type DependencyList, RefObject, useEffect, useRef } from "react"

/**
 * Represents the target element to which the event listener will be attached.
 * This can be a `Window`, `Document`, or any `HTMLElement`.
 */
type EventTarget = Window | Document | HTMLElement | null

/**
 * Represents a target that can be a `Window`, `Document`, `HTMLElement`, from `EventTarget`.
 * or a `RefObject` object
 */
type EventTargetWithRef = EventTarget | RefObject<unknown>

/**
 * Maps event types to their corresponding event objects for different event sources.
 */
type EventMap<EventSource> = EventSource extends Window
    ? WindowEventMap
    : EventSource extends Document
      ? DocumentEventMap
      : EventSource extends HTMLElement
        ? HTMLElementEventMap
        : EventSource extends RefObject<infer Element | null | undefined>
          ? Element extends HTMLElement
              ? HTMLElementEventMap
              : never
          : never

/**
 * Options for the event listener, which can include `capture`, `once`, `passive`, and `deps`.
 */
export interface EventListenerOptions {
    options?: boolean | AddEventListenerOptions
    deps?: DependencyList
    enabled?: boolean | (() => boolean)
}

type TargetRef<T> = T | (() => T)

/**
 * Resolves the target element from the provided input.
 *
 * @param {TargetRef<EventTargetWithRef>} target - The target element to which the event listener will be attached. This can be a `Window`, `Document`, or any `HTMLElement`. It can also be a function that returns the target or a React ref object.
 * @returns {EventTarget} - Returns the resolved target element. If the target is a function, it calls the function to get the target. If it's a ref object, it returns the `current` property of the ref. Otherwise, it returns the target directly.
 */
const getTarget = (target: TargetRef<EventTargetWithRef>): EventTarget => {
    if (!target) return null
    if (target instanceof Function) {
        const value = target()
        if (value && typeof value === "object" && "current" in value) {
            return value.current as EventTarget
        }
        return value
    }
    if (target && typeof target === "object" && "current" in target) {
        return target.current as EventTarget
    }
    return target
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
export const useEventListener = <T extends EventTargetWithRef, K extends keyof EventMap<T>>(
    target: TargetRef<T>,
    type: K,
    event: (this: T, ev: EventMap<T>[K]) => any,
    options: EventListenerOptions = {},
) => {
    const callbackRef = useRef<Function>(event)
    const { options: eventOptions, deps = [], enabled = false } = options

    useEffect(() => {
        callbackRef.current = event
    }, [event])

    useEffect(() => {
        const isEnabled = enabled instanceof Function ? enabled() : enabled
        if (!isEnabled) return
        const get = getTarget(target)
        if (!get) return

        const handleListener = (ev: Event) => callbackRef.current(ev)
        get.addEventListener(type as string, handleListener, eventOptions)

        return () => get.removeEventListener(type as string, handleListener, eventOptions)
    }, [type, target, eventOptions, enabled, ...deps])
}
