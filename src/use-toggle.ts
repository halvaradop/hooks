"use client"
import { useState } from "react"

/**
 * useToggle is a React hook that manages a boolean toggle state.
 *
 * @param {boolean} initial - Initial state of the toggle, defaults to false.
 * @returns {Function} - Returns the current toggle state and a function to update it.
 * @example
 * const [isToggled, toggle] = useToggle();
 */
export const useToggle = (initial: boolean = false): [boolean, (value: boolean) => void] => {
    const [toggled, setToggled] = useState(initial)

    const toggle = (value?: boolean) => {
        setToggled((previous) => value ?? !previous)
    }

    return [toggled, toggle]
}
