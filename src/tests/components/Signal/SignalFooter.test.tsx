import { SignalFooter } from "@/components/Signal/SignalFooter"
import { mockSignal, renderWithProviders } from "@/tests/utils/test-utils"
import "@testing-library/jest-dom"
import { fireEvent, screen } from "@testing-library/react"
import { useDispatch } from "react-redux"
import { vi } from "vitest"

// Mock the redux hooks
vi.mock("react-redux", () => ({
  ...vi.importActual("react-redux"),
  useDispatch: () => vi.fn()
}))

describe("SignalFooter Component", () => {
  const mockUsername = "publisher"

  test("renders signal footer correctly", () => {
    renderWithProviders(<SignalFooter signal={mockSignal} username={mockUsername} />)

    // Check if like button is rendered
    expect(screen.getByRole("button", { name: /like/i })).toBeInTheDocument()

    // Check if the like count is displayed
    expect(screen.getByText(`${mockSignal.likes.length}`)).toBeInTheDocument()
  })

  test("handles like button click", () => {
    const mockDispatch = vi.fn()
    vi.mocked(useDispatch).mockReturnValue(mockDispatch)

    renderWithProviders(<SignalFooter signal={mockSignal} username={mockUsername} />)

    // Find and click the like button
    const likeButton = screen.getByRole("button", { name: /like/i })
    fireEvent.click(likeButton)

    // Check if dispatch was called
    expect(mockDispatch).toHaveBeenCalled()
  })

  test("displays correct like status", () => {
    // Create a signal with likes
    const signalWithLikes = {
      ...mockSignal,
      likes: [{ username: "testuser", name: "Test User", imageUrl: "test-image.jpg" }]
    }

    renderWithProviders(<SignalFooter signal={signalWithLikes} username={mockUsername} />)

    // Check if the like count is updated
    expect(screen.getByText("1")).toBeInTheDocument()

    // The like button should show as active when the current user has liked the signal
    const likeButton = screen.getByRole("button", { name: /like/i })
    expect(likeButton).toHaveClass("active") // Assuming there's an 'active' class for liked state
  })
})
