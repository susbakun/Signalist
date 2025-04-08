import { SignalTopBar } from "@/components/Signal/SignalTopBar"
import { renderWithProviders } from "@/tests/utils/test-utils"
import "@testing-library/jest-dom"
import { screen } from "@testing-library/react"
import { vi } from "vitest"

// Mock the components used in SignalTopBar
vi.mock("@/components", () => ({
  SubscriberSign: () => <div data-testid="subscriber-sign">Subscriber Sign</div>,
  UserPreview: () => <div data-testid="user-preview">User Preview</div>
}))

describe("SignalTopBar Component", () => {
  const mockPublisher = {
    username: "publisher",
    name: "Publisher Name",
    imageUrl: "publisher-image.jpg",
    score: 200
  }

  const mockDate = Date.now()
  const mockSignalId = "123"

  test("renders signal top bar correctly when subscribed", () => {
    renderWithProviders(
      <SignalTopBar
        subscribed={true}
        publisher={mockPublisher}
        date={mockDate}
        signalId={mockSignalId}
      />
    )

    // Check if the user preview is rendered
    expect(screen.getByTestId("user-preview")).toBeInTheDocument()

    // Check if the subscriber sign is rendered when subscribed
    expect(screen.getByTestId("subscriber-sign")).toBeInTheDocument()
  })

  test("renders signal top bar correctly when not subscribed", () => {
    renderWithProviders(
      <SignalTopBar
        subscribed={false}
        publisher={mockPublisher}
        date={mockDate}
        signalId={mockSignalId}
      />
    )

    // Check if the user preview is rendered
    expect(screen.getByTestId("user-preview")).toBeInTheDocument()

    // Check if the subscriber sign is not rendered when not subscribed
    expect(screen.queryByTestId("subscriber-sign")).toBeInTheDocument()
  })
})
