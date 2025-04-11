import { PostFooter } from "@/components/Post/PostFooter"
import * as postsSlice from "@/features/Post/postsSlice"
import { AccountModel, PostModel } from "@/shared/models"
import { SimplifiedAccountType } from "@/shared/types"
import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { vi } from "vitest"

// Mock the hooks and redux store
vi.mock("@/utils", () => ({
  getCurrentUsername: vi.fn().mockReturnValue("testuser")
}))

// Mock the dispatch function
const mockDispatch = vi.fn()
vi.mock("react-redux", async () => {
  const actual = await vi.importActual("react-redux")
  return {
    ...actual,
    useDispatch: () => mockDispatch
  }
})

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

describe("PostFooter Component", () => {
  const mockUser: SimplifiedAccountType = {
    username: "testuser",
    name: "Test User",
    imageUrl: "test-image.jpg"
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

  beforeEach(() => {
    mockDispatch.mockClear()
  })

  test("renders post footer with like and comment buttons", () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <PostFooter post={mockPost} myAccount={mockAccount} />
        </BrowserRouter>
      </Provider>
    )

    expect(screen.getByTestId("like-button")).toBeInTheDocument()
    expect(screen.getByTestId("comment-button")).toBeInTheDocument()
    expect(screen.getByText("0 likes")).toBeInTheDocument()
    expect(screen.getByText("0 comments")).toBeInTheDocument()
  })

  test("displays correct number of likes and comments", () => {
    const postWithLikesAndComments: PostModel = {
      ...mockPost,
      likes: [mockUser, { username: "user2", name: "User Two", imageUrl: "user2-image.jpg" }],
      comments: [
        {
          commentId: "1",
          body: "Test comment",
          date: Date.now(),
          likes: [],
          postId: "1",
          publisher: mockUser
        },
        {
          commentId: "2",
          body: "Another comment",
          date: Date.now(),
          likes: [],
          postId: "1",
          publisher: { username: "user2", name: "User Two", imageUrl: "user2-image.jpg" }
        }
      ]
    }

    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <PostFooter post={postWithLikesAndComments} myAccount={mockAccount} />
        </BrowserRouter>
      </Provider>
    )

    expect(screen.getByText("2 likes")).toBeInTheDocument()
    expect(screen.getByText("2 comments")).toBeInTheDocument()
  })

  test("handles like button click when post is not liked", () => {
    // Spy on the likePostAsync action
    const likePostSpy = vi.spyOn(postsSlice, "likePostAsync")

    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <PostFooter post={mockPost} myAccount={mockAccount} />
        </BrowserRouter>
      </Provider>
    )

    // Click the like button
    fireEvent.click(screen.getByTestId("like-button"))

    // Check if the likePostAsync action was dispatched with correct parameters
    expect(likePostSpy).toHaveBeenCalledWith({
      postId: mockPost.id,
      user: expect.objectContaining({ username: "testuser" })
    })
    expect(mockDispatch).toHaveBeenCalled()
  })

  test("handles like button click when post is already liked", () => {
    // Spy on the dislikePostAsync action
    const dislikePostSpy = vi.spyOn(postsSlice, "dislikePostAsync")

    const likedPost: PostModel = {
      ...mockPost,
      likes: [mockUser]
    }

    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <PostFooter post={likedPost} myAccount={mockAccount} />
        </BrowserRouter>
      </Provider>
    )

    // Click the like button (which should dislike since it's already liked)
    fireEvent.click(screen.getByTestId("like-button"))

    // Check if the dislikePostAsync action was dispatched with correct parameters
    expect(dislikePostSpy).toHaveBeenCalledWith({
      postId: likedPost.id,
      user: expect.objectContaining({ username: "testuser" })
    })
    expect(mockDispatch).toHaveBeenCalled()
  })

  test("toggles comment section when comment button is clicked", () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <PostFooter post={mockPost} myAccount={mockAccount} />
        </BrowserRouter>
      </Provider>
    )

    // Initially, comment section should not be visible
    expect(screen.queryByTestId("comment-section")).not.toBeInTheDocument()

    // Click the comment button
    fireEvent.click(screen.getByTestId("comment-button"))

    // Comment section should now be visible
    expect(screen.getByTestId("comment-section")).toBeInTheDocument()

    // Click the comment button again
    fireEvent.click(screen.getByTestId("comment-button"))

    // Comment section should be hidden again
    expect(screen.queryByTestId("comment-section")).not.toBeInTheDocument()
  })

  test("handles premium post interactions correctly", () => {
    const premiumPost: PostModel = {
      ...mockPost,
      isPremium: true
    }

    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <PostFooter post={premiumPost} myAccount={mockAccount} amISubscribed={false} />
        </BrowserRouter>
      </Provider>
    )

    // Like button should be disabled for non-subscribed users
    const likeButton = screen.getByTestId("like-button")
    expect(likeButton).toBeDisabled()

    // Comment button should be disabled for non-subscribed users
    const commentButton = screen.getByTestId("comment-button")
    expect(commentButton).toBeDisabled()

    // Should show subscription prompt
    expect(screen.getByText("Subscribe to interact")).toBeInTheDocument()
  })

  test("allows interactions for subscribed users on premium posts", () => {
    const premiumPost: PostModel = {
      ...mockPost,
      isPremium: true
    }

    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <PostFooter post={premiumPost} myAccount={mockAccount} amISubscribed={true} />
        </BrowserRouter>
      </Provider>
    )

    // Like button should be enabled for subscribed users
    const likeButton = screen.getByTestId("like-button")
    expect(likeButton).not.toBeDisabled()

    // Comment button should be enabled for subscribed users
    const commentButton = screen.getByTestId("comment-button")
    expect(commentButton).not.toBeDisabled()

    // Should not show subscription prompt
    expect(screen.queryByText("Subscribe to interact")).not.toBeInTheDocument()
  })
})
