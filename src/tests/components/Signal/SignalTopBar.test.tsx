import { SignalTopBar } from "@/components/Signal/SignalTopBar"
import { renderWithProviders } from "@/tests/utils/test-utils"
import "@testing-library/jest-dom"
import { screen } from "@testing-library/react"
import { vi } from "vitest"
import { ReactNode } from "react"

// Mock the components used in SignalTopBar
vi.mock("@/components", () => ({
  CustomAvatar: ({
    placeholderInitials,
    size,
    img,
    rounded
  }: {
    placeholderInitials: string
    size: string
    img?: string
    rounded?: boolean
  }) => (
    <div
      data-testid="custom-avatar"
      data-img={img}
      data-placeholder={placeholderInitials}
      data-size={size}
      data-rounded={rounded ? "true" : "false"}
    >
      Avatar
    </div>
  ),
  SubscriberSign: ({ small }: { small?: boolean }) => (
    <div data-testid="subscriber-sign" data-small={small ? "true" : "false"}>
      Subscriber Sign
    </div>
  ),
  MoreOptionsButton: ({
    signalId,
    username,
    handleOpenEditSignalModal
  }: {
    signalId: string
    username: string
    handleOpenEditSignalModal: () => void
  }) => {
    const onClick = () => handleOpenEditSignalModal()

    return (
      <div
        data-testid="more-options-button"
        data-signal-id={signalId}
        data-username={username}
        onClick={onClick}
      >
        More Options
      </div>
    )
  }
}))

// Mock react-router-dom Link
vi.mock("react-router-dom", () => ({
  Link: ({ to, children, className }: { to: string; children: ReactNode; className?: string }) => (
    <a data-testid="router-link" href={to} className={className}>
      {children}
    </a>
  )
}))

// Mock moment
vi.mock("jalali-moment", () => {
  const momentMock = () => ({
    startOf: () => ({
      fromNow: () => "a few moments ago"
    })
  })
  momentMock.locale = vi.fn()
  return momentMock
})

describe("SignalTopBar Component", () => {
  const mockPublisher = {
    username: "publisher",
    name: "Publisher Name",
    imageUrl: "publisher-image.jpg",
    score: 200
  }

  const mockDate = Date.now()
  const mockSignalId = "123"
  const mockHandleOpenEditSignalModal = vi.fn()

  test("renders signal top bar correctly when subscribed", () => {
    renderWithProviders(
      <SignalTopBar
        subscribed={true}
        publisher={mockPublisher}
        date={mockDate}
        signalId={mockSignalId}
        handleOpenEditSignalModal={mockHandleOpenEditSignalModal}
      />
    )

    // Check if the avatar is rendered
    expect(screen.getByTestId("custom-avatar")).toBeInTheDocument()

    // Check if the username link is rendered
    expect(screen.getByTestId("router-link")).toHaveAttribute("href", "/publisher")

    // Check if the subscriber sign is rendered when subscribed
    expect(screen.getByTestId("subscriber-sign")).toBeInTheDocument()

    // Check if more options button is rendered
    expect(screen.getByTestId("more-options-button")).toBeInTheDocument()
  })

  test("renders signal top bar correctly when not subscribed", () => {
    renderWithProviders(
      <SignalTopBar
        subscribed={false}
        publisher={mockPublisher}
        date={mockDate}
        signalId={mockSignalId}
        handleOpenEditSignalModal={mockHandleOpenEditSignalModal}
      />
    )

    // Check if the avatar is rendered
    expect(screen.getByTestId("custom-avatar")).toBeInTheDocument()

    // Check if the username link is rendered
    expect(screen.getByTestId("router-link")).toHaveAttribute("href", "/publisher")

    // Check if the subscriber sign is not rendered when not subscribed
    expect(screen.queryByTestId("subscriber-sign")).not.toBeInTheDocument()
  })
})
