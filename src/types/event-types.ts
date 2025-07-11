import type { DependencyList, RefObject } from "react"

/**
 * Represents the target element to which the event listener will be attached.
 * This can be a `Window`, `Document`, or any `HTMLElement`.
 */
export type EventTarget = Window | Document | HTMLElement | null

/**
 * Represents a target that can be a `Window`, `Document`, `HTMLElement`, from `EventTarget`.
 * or a `RefObject` object
 */
export type EventTargetWithRef = EventTarget | RefObject<unknown>

/**
 * Maps event types to their corresponding event objects for different event sources.
 */
export type EventMap<EventSource> = EventSource extends Window
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

/**
 * Represents a reference to a target element that can be used in hooks.
 * It can be a direct reference to an `EventTargetWithRef` or a function that returns such a target.
 */
export type TargetRef<T> = T | (() => T)
