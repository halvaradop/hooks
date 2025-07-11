"use client"
import { useState } from "react"
import type { UseToggle } from "@/types/hook-types"

/**
 * useToggle is a React hook that manages a boolean toggle state.
 *
 * @param {boolean} initial - Initial state of the toggle, defaults to false.
 * @returns {boolean} - Returns the current toggle state and a function to update it.
 * @example
 * const MyComponent = () => {
 *   const [isToggled, toggle] = useToggle();
 *
 *   return (
 *     <section>
 *       <button onClick={() => toggle()}>Toggle</button>
 *       <p>{isToggled ? "On" : "Off"}</p>
 *       <div>
 *         <button onClick={() => toggle(true)}>Set On</button>
 *         <button onClick={() => toggle(false)}>Set Off</button>
 *       </div>
 *     </section>
 *   )
 * }
 */
export const useToggle: UseToggle = (initial = false) => {
    const [toggled, setToggled] = useState(initial)

    const toggle = (value?: boolean) => {
        setToggled((previous) => value ?? !previous)
    }

    return [toggled, toggle]
}
