import { AccountModel, PostModel, SignalModel } from "@/shared/models"
import { render, RenderOptions } from "@testing-library/react"
import React, { ReactElement } from "react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { vi } from "vitest"

// Create mock data that can be reused across tests
export const mockUsers: AccountModel[] = [
  {
    name: "Test User",
    username: "testuser",
    email: "test@example.com",
    password: "password",
    imageUrl: "test-image.jpg",
    score: 100,
    hasPremium: false,
    followings: [],
    followers: [],
    bookmarks: { signals: [], posts: [] },
    blockedAccounts: []
  },
  {
    name: "Publisher",
    username: "publisher",
    email: "publisher@example.com",
    password: "password",
    imageUrl: "publisher-image.jpg",
    score: 200,
    hasPremium: true,
    followings: [],
    followers: [],
    bookmarks: { signals: [], posts: [] },
    blockedAccounts: []
  }
]

export const mockSignal: SignalModel = {
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
    name: "Publisher",
    imageUrl: "publisher-image.jpg",
    score: 200
  }
}

export const mockPost: PostModel = {
  id: "1",
  content: "Test post content",
  date: Date.now(),
  likes: [],
  comments: [],
  isPremium: false,
  publisher: {
    username: "publisher",
    name: "Publisher",
    imageUrl: "publisher-image.jpg"
  }
}

// Create a mock store
export const mockStore = {
  getState: () => ({
    users: mockUsers,
    signals: [mockSignal],
    posts: [mockPost]
  }),
  subscribe: vi.fn(),
  dispatch: vi.fn()
}

// Setup common mocks
export const setupMocks = () => {
  // Mock the hooks and redux store
  vi.mock("@/hooks/useIsUserBlocked", () => ({
    useIsUserBlocked: () => ({
      isUserBlocked: vi.fn().mockReturnValue(false)
    })
  }))

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
      return selector({
        users: mockUsers
      })
    })
  }))

  vi.mock("@/features/Post/postsSlice", () => ({
    useAppSelector: vi.fn().mockImplementation((selector) => {
      return selector({
        users: mockUsers,
        signals: [mockSignal],
        posts: [mockPost]
      })
    })
  }))

  vi.mock("@/utils", () => ({
    getCurrentUsername: vi.fn().mockReturnValue("testuser")
  }))

  vi.mock("react-redux", () => ({
    ...vi.importActual("react-redux"),
    useDispatch: () => vi.fn()
  }))
}

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  route?: string
}

export function renderWithProviders(ui: ReactElement, options?: CustomRenderOptions) {
  const { route = "/", ...renderOptions } = options || {}

  window.history.pushState({}, "Test page", route)

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}
