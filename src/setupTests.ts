import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

// Using jest-dom with Vitest

// Run cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})
