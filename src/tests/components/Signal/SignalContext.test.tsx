import { SignalContext } from "@/components/Signal/SignalContext"
import { mockSignal, renderWithProviders } from "@/tests/utils/test-utils"
import "@testing-library/jest-dom"
import { fireEvent, screen } from "@testing-library/react"
import { vi } from "vitest"

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockImplementation(() => Promise.resolve())
  }
})

describe("SignalContext Component", () => {
  test("renders signal context correctly", () => {
    renderWithProviders(<SignalContext signal={mockSignal} />)

    // Check if the market name is displayed
    expect(screen.getByText(mockSignal.market.name)).toBeInTheDocument()

    // Check if entry price is displayed
    expect(screen.getByText(`Entry: $${mockSignal.entry.toLocaleString()}`)).toBeInTheDocument()

    // Check if stoploss is displayed
    expect(
      screen.getByText(`Stoploss: $${mockSignal.stoploss.toLocaleString()}`)
    ).toBeInTheDocument()

    // Check if targets are displayed
    mockSignal.targets.forEach((target, index) => {
      expect(
        screen.getByText(`Target ${index + 1}: $${target.value.toLocaleString()}`)
      ).toBeInTheDocument()
    })

    // Check if description is displayed when available
    if (mockSignal.description) {
      expect(screen.getByText(mockSignal.description)).toBeInTheDocument()
    }
  })

  test("handles target copy functionality", async () => {
    renderWithProviders(<SignalContext signal={mockSignal} />)

    // Find and click the copy button for the first target
    const copyButtons = screen.getAllByRole("button", { name: /copy/i })
    fireEvent.click(copyButtons[0])

    // Check if clipboard API was called with the correct value
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      mockSignal.targets[0].value.toString()
    )
  })

  test("displays premium badge for premium signals", () => {
    const premiumSignal = {
      ...mockSignal,
      isPremium: true
    }

    renderWithProviders(<SignalContext signal={premiumSignal} />)

    // Check if premium badge is displayed
    expect(screen.getByText(/premium/i)).toBeInTheDocument()
  })

  test("does not display premium badge for non-premium signals", () => {
    const nonPremiumSignal = {
      ...mockSignal,
      isPremium: false
    }

    renderWithProviders(<SignalContext signal={nonPremiumSignal} />)

    // Check that premium badge is not displayed
    expect(screen.queryByText(/premium/i)).not.toBeInTheDocument()
  })
})
