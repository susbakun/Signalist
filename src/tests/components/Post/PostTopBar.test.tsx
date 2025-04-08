/* eslint-disable @typescript-eslint/no-explicit-any */
import { PostTopBar } from "@/components/Post/PostTopBar"
import { PostModel } from "@/shared/models"
import * as utilsModule from "@/utils"
import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { vi } from "vitest"

// Mock the hooks and redux store
vi.mock("@/utils", () => ({
  getCurrentUsername: vi.fn().mockReturnValue("testuser"),
  formatDate: vi.fn().mockReturnValue("2 hours ago")
}))

// Mock the useIsUserBlocked hook
vi.mock("@/hooks/useIsUserBlocked", () => ({
  useIsUserBlocked: () => ({
    isUserBlocked: vi.fn().mockReturnValue(false)
  })
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
    ]
  }),
  subscribe: vi.fn(),
  dispatch: vi.fn()
}

describe("PostTopBar Component", () => {
  const mockPost: PostModel = {
    id: "1",
    content: "Test post content",
    date: Date.now() - 7200000, // 2 hours ago
    likes: [],
    comments: [],
    isPremium: false,
    publisher: {
      username: "publisher",
      name: "Publisher Name",
      imageUrl: "publisher-image.jpg"
    }
  }

  const mockHandleOpenEditPostModal = vi.fn()

  test("renders post top bar with publisher information", () => {
    render(
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <PostTopBar
            postId={mockPost.id}
            date={mockPost.date}
            handleOpenEditPostModal={mockHandleOpenEditPostModal}
            {...mockPost.publisher}
          />
        </BrowserRouter>
      </Provider>
    )

    // Check if publisher name is displayed
    expect(screen.getByText("Publisher Name")).toBeInTheDocument()

    // Check if publisher username is displayed
    expect(screen.getByText("@publisher")).toBeInTheDocument()

    // Check if post date is displayed
    expect(screen.getByText("2 hours ago")).toBeInTheDocument()
  })

  test("navigates to publisher profile when clicked", () => {
    render(
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <PostTopBar
            postId={mockPost.id}
            date={mockPost.date}
            handleOpenEditPostModal={mockHandleOpenEditPostModal}
            {...mockPost.publisher}
          />
        </BrowserRouter>
      </Provider>
    )

    // Find the publisher name link
    const publisherNameLink = screen.getByText("Publisher Name").closest("a")
    expect(publisherNameLink).toHaveAttribute("href", "/publisher")
  })

  test("shows edit button when current user is the publisher", async () => {
    // Mock getCurrentUsername to return the publisher's username
    const utils = await vi.importMock<typeof utilsModule>("@/utils")
    const getCurrentUsernameMock = utils.getCurrentUsername as unknown as jest.Mock
    getCurrentUsernameMock.mockReturnValueOnce("publisher")

    render(
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <PostTopBar
            postId={mockPost.id}
            date={mockPost.date}
            handleOpenEditPostModal={mockHandleOpenEditPostModal}
            {...mockPost.publisher}
          />
        </BrowserRouter>
      </Provider>
    )

    // Check if edit button is displayed
    const editButton = screen.getByTestId("edit-post-button")
    expect(editButton).toBeInTheDocument()

    // Click the edit button
    fireEvent.click(editButton)

    // Check if handleOpenEditPostModal was called
    expect(mockHandleOpenEditPostModal).toHaveBeenCalled()
  })

  test("does not show edit button when current user is not the publisher", () => {
    render(
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <PostTopBar
            postId={mockPost.id}
            date={mockPost.date}
            handleOpenEditPostModal={mockHandleOpenEditPostModal}
            {...mockPost.publisher}
          />
        </BrowserRouter>
      </Provider>
    )

    // Check if edit button is not displayed
    expect(screen.queryByTestId("edit-post-button")).not.toBeInTheDocument()
  })
})
