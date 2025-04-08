import { Signal } from "@/components/Signal/Signal"
import { SignalModel } from "@/shared/models"
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { vi } from "vitest"

// Mock the hooks and redux store
vi.mock("@/hooks/useIsUserBlocked", () => ({
  useIsUserBlocked: () => ({
    isUserBlocked: vi.fn().mockReturnValue(false)
  })
}))

// Add type for useIsUserBlocked mock
const useIsUserBlocked = vi.fn().mockReturnValue({
  isUserBlocked: vi.fn().mockReturnValue(false)
})

vi.mock("@/hooks/useIsUserSubscribed", () => ({
  useIsUserSubscribed: () => ({
    amISubscribed: false
  })
}))

vi.mock("@/services/cryptoApi", () => ({
  useGetCryptosQuery: () => ({
    data: {
      data: {
        coins: []
      }
    }
  })
}))

vi.mock("@/features/Message/messagesSlice", () => ({
  useAppSelector: vi.fn().mockImplementation((selector) => {
    // Mock the state that useAppSelector would return
    const mockState = {
      users: [
        {
          username: "testuser",
          name: "Test User",
          imageUrl: "test-image.jpg",
          score: 100,
          blockedAccounts: [],
          followers: [],
          followings: []
        }
      ]
    }
    return selector(mockState)
  })
}))

vi.mock("@/utils", () => ({
  getCurrentUsername: vi.fn().mockReturnValue("testuser")
}))

vi.mock("react-redux", () => ({
  ...vi.importActual("react-redux"),
  useDispatch: () => vi.fn()
}))

// Create a mock store
const mockStore = {
  getState: () => ({
    users: [
      {
        username: "testuser",
        name: "Test User",
        imageUrl: "test-image.jpg",
        score: 100,
        blockedAccounts: [],
        followers: [],
        followings: []
      }
    ],
    signals: []
  }),
  subscribe: vi.fn(),
  dispatch: vi.fn()
}

// Mock the Signal components
vi.mock("@/components", () => ({
  SignalTopBar: () => <div data-testid="signal-top-bar">Signal Top Bar</div>,
  SignalContext: () => <div data-testid="signal-context">Signal Context</div>,
  SignalFooter: () => <div data-testid="signal-footer">Signal Footer</div>
}))

describe("Signal Component", () => {
  const mockSignal: SignalModel = {
    id: "1",
    market: {
      name: "Bitcoin",
      uuid: "bitcoin-uuid"
    },
    entry: 50000,
    stoploss: 48000,
    targets: [
      { id: "1", value: 52000, touched: false },
      { id: "2", value: 55000, touched: false }
    ],
    openTime: Date.now(),
    closeTime: Date.now() + 86400000, // 24 hours later
    status: "open",
    date: Date.now(),
    likes: [],
    description: "Test signal description",
    isPremium: false,
    publisher: {
      username: "publisher",
      name: "Publisher Name",
      imageUrl: "publisher-image.jpg",
      score: 200
    }
  }

  test("renders signal component correctly", () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <Signal signal={mockSignal} />
        </BrowserRouter>
      </Provider>
    )

    expect(screen.getByTestId("signal-top-bar")).toBeInTheDocument()
    expect(screen.getByTestId("signal-context")).toBeInTheDocument()
    expect(screen.getByTestId("signal-footer")).toBeInTheDocument()
  })

  test("does not render when user is blocked", () => {
    // Override the mock to return true for isUserBlocked
    vi.mocked(useIsUserBlocked).mockReturnValue({
      isUserBlocked: vi.fn().mockReturnValue(true)
    })

    const { container } = render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <Signal signal={mockSignal} />
        </BrowserRouter>
      </Provider>
    )

    expect(container.firstChild).toBeNull()
  })
})
