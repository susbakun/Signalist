import { useAppSelector } from "@/features/Post/postsSlice"
import { FollowingsPosts } from "@/pages/FollowingsPosts"
import { PostModel } from "@/shared/models"
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { vi } from "vitest"

// Mock the hooks and redux store
vi.mock("@/features/Post/postsSlice", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useAppSelector: vi.fn().mockImplementation((selector: (state: any) => any) => {
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
          followings: [
            { username: "publisher", name: "Publisher", imageUrl: "publisher-image.jpg" }
          ]
        },
        {
          username: "publisher",
          name: "Publisher",
          imageUrl: "publisher-image.jpg",
          score: 200,
          blockedAccounts: [],
          followers: [],
          followings: []
        }
      ],
      posts: [
        {
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
        },
        {
          id: "2",
          content: "Another test post",
          date: Date.now() - 86400000, // 1 day ago
          likes: [],
          comments: [],
          isPremium: false,
          publisher: {
            username: "anotheruser",
            name: "Another User",
            imageUrl: "another-image.jpg"
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

// Mock the Post component
vi.mock("@/components", () => ({
  Post: ({ post }: { post: PostModel }) => (
    <div data-testid="post-component" data-post-id={post.id}>
      {post.content}
    </div>
  ),
  EmptyPage: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="empty-page" className={className}>
      {children}
    </div>
  )
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
        followings: [{ username: "publisher", name: "Publisher", imageUrl: "publisher-image.jpg" }]
      }
    ],
    posts: [
      {
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
    ]
  }),
  subscribe: vi.fn(),
  dispatch: vi.fn()
}

describe("FollowingsPosts Component", () => {
  test("renders posts from followed users", () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <FollowingsPosts />
        </BrowserRouter>
      </Provider>
    )

    // Check if posts from followed users are rendered
    const postComponents = screen.getAllByTestId("post-component")
    expect(postComponents.length).toBeGreaterThan(0)

    // Verify the post content is displayed
    expect(screen.getByText("Test post content")).toBeInTheDocument()

    // Verify that posts from non-followed users are not displayed
    expect(screen.queryByText("Another test post")).not.toBeInTheDocument()
  })

  test("renders empty page when no following posts exist", () => {
    // Override the mock to return no following posts
    vi.mocked(useAppSelector).mockImplementationOnce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (selector: (state: any) => any) => {
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
          ],
          posts: [
            {
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
          ]
        }
        return selector(mockState)
      }
    )

    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <FollowingsPosts />
        </BrowserRouter>
      </Provider>
    )

    // Check if the empty page is rendered
    expect(screen.getByTestId("empty-page")).toBeInTheDocument()
    expect(screen.getByText("There are no posts yet")).toBeInTheDocument()
  })
})
