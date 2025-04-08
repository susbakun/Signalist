import { useIsUserSubscribed } from "@/hooks/useIsUserSubscribed"
import { renderHook } from "@testing-library/react"
import { Provider } from "react-redux"
import { vi } from "vitest"

// Mock the redux hooks and utils
vi.mock("@/features/Post/postsSlice", () => ({
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
          followings: [],
          subscribers: [{ username: "subscriber1", expireDate: Date.now() + 86400000 }]
        },
        {
          username: "publisher",
          name: "Publisher",
          imageUrl: "publisher-image.jpg",
          score: 200,
          blockedAccounts: [],
          followers: [],
          followings: [],
          subscribers: [{ username: "testuser", expireDate: Date.now() + 86400000 }]
        }
      ]
    }
    return selector(mockState)
  })
}))

vi.mock("@/utils", () => ({
  getCurrentUsername: vi.fn().mockReturnValue("testuser")
}))

// Create a wrapper component with the Redux provider
const wrapper = ({ children }: { children: React.ReactNode }) => {
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
          followings: [],
          subscribers: [{ username: "subscriber1", expireDate: Date.now() + 86400000 }]
        },
        {
          username: "publisher",
          name: "Publisher",
          imageUrl: "publisher-image.jpg",
          score: 200,
          blockedAccounts: [],
          followers: [],
          followings: [],
          subscribers: [{ username: "testuser", expireDate: Date.now() + 86400000 }]
        }
      ]
    }),
    subscribe: vi.fn(),
    dispatch: vi.fn()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Provider store={mockStore as any}>{children}</Provider>
}

describe("useIsUserSubscribed hook", () => {
  it("should return true when user is subscribed to publisher", () => {
    const publisher = {
      username: "publisher",
      name: "Publisher",
      imageUrl: "publisher-image.jpg"
    }

    const { result } = renderHook(() => useIsUserSubscribed(publisher), { wrapper })
    expect(result.current.amISubscribed).toBe(true)
  })

  it("should return false when user is not subscribed to publisher", () => {
    const publisher = {
      username: "not-subscribed-publisher",
      name: "Not Subscribed Publisher",
      imageUrl: "not-subscribed-image.jpg"
    }

    const { result } = renderHook(() => useIsUserSubscribed(publisher), { wrapper })
    expect(result.current.amISubscribed).toBe(undefined)
  })
})
