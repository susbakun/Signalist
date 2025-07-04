import { SignalsPage } from "@/pages/SignalsPage"
import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { vi } from "vitest"

vi.mock("@/features/Post/postsSlice", () => ({
  useAppSelector: vi.fn().mockImplementation((selector) => {
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
        },
        {
          username: "user2",
          name: "User Two",
          imageUrl: "user2-image.jpg",
          score: 200,
          blockedAccounts: [],
          followers: [],
          followings: []
        },
        {
          username: "user3",
          name: "User Three",
          imageUrl: "user3-image.jpg",
          score: 150,
          blockedAccounts: [],
          followers: [],
          followings: []
        }
      ],
      signals: [
        {
          id: "1",
          market: { name: "Bitcoin", uuid: "bitcoin-uuid" },
          entry: 50000,
          stoploss: 48000,
          targets: [{ id: "1", value: 52000, touched: false }],
          openTime: Date.now(),
          closeTime: Date.now() + 86400000,
          status: "open",
          date: Date.now(),
          likes: [],
          isPremium: false,
          publisher: {
            username: "publisher",
            name: "Publisher Name",
            imageUrl: "publisher-image.jpg",
            score: 200
          }
        },
        {
          id: "2",
          market: { name: "Ethereum", uuid: "ethereum-uuid" },
          entry: 3000,
          stoploss: 2800,
          targets: [{ id: "1", value: 3200, touched: false }],
          openTime: Date.now() - 86400000,
          closeTime: Date.now() + 86400000,
          status: "open",
          date: Date.now() - 86400000,
          likes: [],
          isPremium: false,
          publisher: {
            username: "publisher2",
            name: "Publisher Two",
            imageUrl: "publisher2-image.jpg",
            score: 150
          }
        }
      ]
    }
    return selector(mockState)
  })
}))

vi.mock("@/utils", () => ({
  getCurrentUsername: vi.fn().mockReturnValue("testuser")
}))

// Mock the components used in SignalsPage
vi.mock("@/components", () => ({
  CreateSignalButton: ({ handleOpenModal }: { handleOpenModal: () => void }) => (
    <button data-testid="create-signal-button" onClick={handleOpenModal}>
      Create Signal
    </button>
  ),
  CreateSignalModal: ({ openModal }: { openModal: boolean }) =>
    openModal ? <div data-testid="create-signal-modal">Create Signal Modal</div> : null,
  Signal: () => <div data-testid="signal-component">Signal Component</div>,
  StreamingUser: () => <div data-testid="streaming-user">Streaming User</div>
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
      },
      {
        username: "user2",
        name: "User Two",
        imageUrl: "user2-image.jpg",
        score: 200,
        blockedAccounts: [],
        followers: [],
        followings: []
      }
    ],
    signals: [
      {
        id: "1",
        market: { name: "Bitcoin", uuid: "bitcoin-uuid" },
        entry: 50000,
        stoploss: 48000,
        targets: [{ id: "1", value: 52000, touched: false }],
        openTime: Date.now(),
        closeTime: Date.now() + 86400000,
        status: "open",
        date: Date.now(),
        likes: [],
        isPremium: false,
        publisher: {
          username: "publisher",
          name: "Publisher Name",
          imageUrl: "publisher-image.jpg",
          score: 200
        }
      }
    ]
  }),
  subscribe: vi.fn(),
  dispatch: vi.fn()
}

describe("SignalsPage Component", () => {
  test("renders signals page correctly", () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <SignalsPage />
        </BrowserRouter>
      </Provider>
    )

    // Check if the main sections are rendered
    expect(screen.getByText("Signals")).toBeInTheDocument()
    expect(screen.getByTestId("create-signal-button")).toBeInTheDocument()

    // The Signal components should be rendered based on the mock data
    const signalComponents = screen.getAllByTestId("signal-component")
    expect(signalComponents.length).toBeGreaterThan(0)

    // The StreamingUser components should be rendered in the sidebar
    const streamingUsers = screen.getAllByTestId("streaming-user")
    expect(streamingUsers.length).toBeGreaterThan(0)

    // Initially, the create signal modal should not be visible
    expect(screen.queryByTestId("create-signal-modal")).not.toBeInTheDocument()
  })

  test("opens create signal modal when button is clicked", async () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <SignalsPage />
        </BrowserRouter>
      </Provider>
    )

    // Find and click the create signal button
    const createButton = screen.getByTestId("create-signal-button")
    fireEvent.click(createButton)

    // After clicking, the modal should be visible
    expect(screen.getByTestId("create-signal-modal")).toBeInTheDocument()
  })
})
