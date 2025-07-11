# @halvaradop/hooks

[![npm version](https://badge.fury.io/js/@halvaradop%2Fhooks.svg)](https://badge.fury.io/js/@halvaradop%2Fhooks)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A comprehensive collection of reusable React hooks designed to simplify common patterns and enhance your development experience. Built with TypeScript for excellent developer experience and type safety.

## Table of Contents

- [Installation](#installation)
- [Available Hooks](#available-hooks)
- [Usage Examples](#usage-examples)
- [Advanced Usage](#advanced-usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
# npm
npm install @halvaradop/hooks

# yarn
yarn add @halvaradop/hooks

# pnpm
pnpm add @halvaradop/hooks
```

## Available Hooks

### State Management

- [`useLocalStorage`](#uselocalstorage) - Sync state with localStorage
- [`useSessionStorage`](#usesessionstorage) - Sync state with sessionStorage
- [`useToggle`](#usetoggle) - Boolean state toggle functionality

### Event Handling

- [`useEventListener`](#useeventlistener) - Add event listeners to any element
- [`useDocumentEventListener`](#usedocumenteventlistener) - Listen to document events
- [`useWindowEventListener`](#usewindoweventlistener) - Listen to window events
- [`useOnClickOutside`](#useonclickoutside) - Detect clicks outside an element

### Browser APIs

- [`useBroadcastChannel`](#usebroadcastchannel) - Cross-tab communication
- [`useCopyToClipboard`](#usecopytoclipboard) - Copy text to clipboard
- [`useOnlineStatus`](#useonlinestatus) - Monitor network connectivity
- [`useMediaQuery`](#usemediaquery) - Responsive design helper
- [`useWindowSize`](#usewindowsize) - Track window dimensions

### Timing

- [`useInterval`](#useinterval) - Declarative intervals

## Usage Examples

### useLocalStorage

Synchronize state with localStorage, with automatic serialization and cross-tab synchronization.

```tsx
import { useLocalStorage } from "@halvaradop/hooks"

function Settings() {
  const [theme, setTheme, removeTheme] = useLocalStorage("theme", "light", {
    withEvent: true, // Sync across tabs
  })

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme("dark")}>Dark Mode</button>
      <button onClick={() => setTheme("light")}>Light Mode</button>
      <button onClick={removeTheme}>Reset</button>
    </div>
  )
}
```

### useSessionStorage

Synchronize state with sessionStorage, similar to localStorage but session-scoped.

```tsx
import { useSessionStorage } from "@halvaradop/hooks"

function SessionSettings() {
  const [settings, setSettings, removeSettings] = useSessionStorage("session-settings", {
    theme: "auto",
    language: "en",
  })

  return (
    <div>
      <p>Current settings: {JSON.stringify(settings)}</p>
      <button onClick={() => setSettings({ ...settings, theme: "dark" })}>Dark Theme</button>
      <button onClick={removeSettings}>Clear Session</button>
    </div>
  )
}
```

### useDocumentEventListener

Listen to document events with automatic cleanup.

```tsx
import { useDocumentEventListener } from "@halvaradop/hooks"

function GlobalShortcuts() {
  useDocumentEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "k") {
      event.preventDefault()
      openCommandPalette()
    }
  })

  useDocumentEventListener("click", (event) => {
    console.log("Document clicked at:", event.clientX, event.clientY)
  })

  return <div>Global shortcuts are active!</div>
}
```

### useWindowEventListener

Listen to window events like resize, focus, etc.

```tsx
import { useWindowEventListener } from "@halvaradop/hooks"

function WindowEvents() {
  useWindowEventListener("resize", () => {
    console.log("Window resized to:", window.innerWidth, window.innerHeight)
  })

  useWindowEventListener("focus", () => {
    console.log("Window gained focus")
  })

  useWindowEventListener("blur", () => {
    console.log("Window lost focus")
  })

  return <div>Window event listeners are active!</div>
}
```

### useOnClickOutside

Detect clicks outside a specific element.

```tsx
import { useOnClickOutside } from "@halvaradop/hooks"
import { useRef, useState } from "react"

function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(dropdownRef, () => {
    setIsOpen(false)
  })

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle Menu</button>
      {isOpen && (
        <div ref={dropdownRef} className="dropdown">
          <p>Click outside to close</p>
          <button>Menu Item 1</button>
          <button>Menu Item 2</button>
        </div>
      )}
    </div>
  )
}
```

### useCopyToClipboard

Copy text to clipboard with success/error handling.

```tsx
import { useCopyToClipboard } from "@halvaradop/hooks"

function CopyButton() {
  const [copiedText, copyToClipboard] = useCopyToClipboard()

  const handleCopy = async () => {
    const success = await copyToClipboard("Hello, World!")
    if (success) {
      console.log("Text copied successfully!")
    } else {
      console.error("Failed to copy text")
    }
  }

  return (
    <div>
      <button onClick={handleCopy}>Copy Text</button>
      {copiedText && <p>Last copied: {copiedText}</p>}
    </div>
  )
}
```

### useWindowSize

Track window dimensions with automatic updates on resize.

```tsx
import { useWindowSize } from "@halvaradop/hooks"

function WindowInfo() {
  const { width, height } = useWindowSize()

  return (
    <div>
      <p>
        Window size: {width} x {height}
      </p>
      <p>Aspect ratio: {(width / height).toFixed(2)}</p>
      {width < 768 && <p>Mobile view</p>}
      {width >= 768 && width < 1024 && <p>Tablet view</p>}
      {width >= 1024 && <p>Desktop view</p>}
    </div>
  )
}
```

### useInterval

Set up intervals with automatic cleanup.

```tsx
import { useInterval } from "@halvaradop/hooks"
import { useState } from "react"

function Timer() {
  const [count, setCount] = useState(0)
  const [isRunning, setIsRunning] = useState(true)

  useInterval(
    () => {
      setCount(count + 1)
    },
    isRunning ? 1000 : null,
  ) // Pass null to pause

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? "Pause" : "Start"}</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}
```

### useEventListener

Add event listeners with automatic cleanup and TypeScript support.

```tsx
import { useEventListener } from "@halvaradop/hooks"
import { useRef } from "react"

function KeyboardHandler() {
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Global keyboard listener
  useEventListener(document, "keydown", (event) => {
    if (event.ctrlKey && event.key === "s") {
      event.preventDefault()
      console.log("Save shortcut pressed!")
    }
  })

  // Element-specific listener
  useEventListener(buttonRef, "click", () => {
    console.log("Button clicked!")
  })

  return <button ref={buttonRef}>Click me</button>
}
```

### useMediaQuery

Create responsive components with CSS media queries.

```tsx
import { useMediaQuery } from "@halvaradop/hooks"

function ResponsiveComponent() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)")
  const isDesktop = useMediaQuery("(min-width: 1025px)")

  return (
    <div>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </div>
  )
}
```

### useBroadcastChannel

Communicate between tabs/windows using the BroadcastChannel API.

```tsx
import { useBroadcastChannel } from "@halvaradop/hooks"

function CrossTabChat() {
  const [message, sendMessage, closeChannel, isSupported] = useBroadcastChannel("chat-channel")

  const handleSendMessage = () => {
    sendMessage({ text: "Hello from this tab!", timestamp: Date.now() })
  }

  return (
    <div>
      {isSupported ? (
        <>
          <p>Last message: {message?.text}</p>
          <button onClick={handleSendMessage}>Send Message</button>
          <button onClick={closeChannel}>Close Channel</button>
        </>
      ) : (
        <p>BroadcastChannel not supported</p>
      )}
    </div>
  )
}
```

### useOnlineStatus

Monitor network connectivity status.

```tsx
import { useOnlineStatus } from "@halvaradop/hooks"

function NetworkStatus() {
  const isOnline = useOnlineStatus()

  return <div className={isOnline ? "online" : "offline"}>{isOnline ? "🟢 Online" : "🔴 Offline"}</div>
}
```

### useToggle

Manage boolean state with toggle functionality.

```tsx
import { useToggle } from "@halvaradop/hooks"

function ToggleExample() {
  const [isVisible, toggleVisible] = useToggle(false)

  return (
    <div>
      <button onClick={() => toggleVisible()}>{isVisible ? "Hide" : "Show"} Content</button>
      {isVisible && <p>This content is toggleable!</p>}
    </div>
  )
}
```

## Contributing

We welcome contributions to `@halvaradop/hooks`! If you have an idea for a new type or find an improvement to an existing one, please feel free to open an issue or create a pull request. We offer a guide on how to contribute to the project and the necessary steps to do so. Here's how you can contribute, Read our [Contribuing Guideline](https://github.com/halvaradop/.github/blob/master/.github/CONTRIBUTING.md).

## Code of conduct

Please be aware that this project has a code of conduct, and we expect all contributors to follow these guidelines in their interactions. For more information, please read our [Code of Conduct](https://github.com/halvaradop/.github/blob/master/.github/CODE_OF_CONDUCT.md).
