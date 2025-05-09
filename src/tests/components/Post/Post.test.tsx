import { Post } from "@/components/Post/Post"
import { AccountModel, PostModel } from "@/shared/models"
import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
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
    posts: []
  }),
  subscribe: vi.fn(),
  dispatch: vi.fn()
}

// Mock the Post components
vi.mock("@/components", () => ({
  PostTopBar: () => <div data-testid="post-top-bar">Post Top Bar</div>,
  PostBody: () => <div data-testid="post-body">Post Body</div>,
  PostFooter: () => <div data-testid="post-footer">Post Footer</div>,
  EditPostModal: ({ openModal }: { openModal: boolean }) =>
    openModal ? <div data-testid="edit-post-modal">Edit Post Modal</div> : null
}))

describe("Post Component", () => {
  const mockPost: PostModel = {
    id: "1",
    content: "Test post content",
    date: Date.now(),
    likes: [],
    comments: [],
    isPremium: false,
    postImageHref: "post-123.png",
    publisher: {
      username: "publisher",
      name: "Publisher Name",
      imageUrl: "publisher-image.jpg"
    }
  }

  const mockAccount: AccountModel = {
    username: "testuser",
    name: "Test User",
    email: "test@example.com",
    password: "password",
    imageUrl: "test-image.jpg",
    score: 100,
    hasPremium: false,
    followings: [],
    followers: [],
    bookmarks: { signals: [], posts: [] },
    blockedAccounts: []
  }

  test("renders post component correctly", () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <Post post={mockPost} myAccount={mockAccount} />
        </BrowserRouter>
      </Provider>
    )

    expect(screen.getByTestId("post-top-bar")).toBeInTheDocument()
    expect(screen.getByTestId("post-body")).toBeInTheDocument()
    expect(screen.getByTestId("post-footer")).toBeInTheDocument()
    expect(screen.queryByTestId("edit-post-modal")).not.toBeInTheDocument()
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
          <Post post={mockPost} myAccount={mockAccount} />
        </BrowserRouter>
      </Provider>
    )

    expect(container.firstChild).toBeNull()
  })

  test("opens edit post modal when edit button is clicked", () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <Post post={mockPost} myAccount={mockAccount} />
        </BrowserRouter>
      </Provider>
    )

    // Initially the modal should not be visible
    expect(screen.queryByTestId("edit-post-modal")).not.toBeInTheDocument()

    // Find and click the edit button (assuming it's in the PostTopBar)
    const editButton = screen.getByTestId("edit-post-button")
    fireEvent.click(editButton)

    // Modal should now be visible
    expect(screen.getByTestId("edit-post-modal")).toBeInTheDocument()
  })

  test("handles premium post correctly", () => {
    const premiumPost: PostModel = {
      ...mockPost,
      isPremium: true
    }

    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <Post post={premiumPost} myAccount={mockAccount} />
        </BrowserRouter>
      </Provider>
    )

    // Check if the premium content is blurred
    expect(screen.getByTestId("blured-post-component")).toBeInTheDocument()
  })
})
