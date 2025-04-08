import { useAppSelector } from "@/features/Post/postsSlice"
import { SuggestionsPosts } from "@/pages/SuggestionsPosts"
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
      posts: [
        {
          id: "1",
          content: "First test post",
          date: Date.now(),
          likes: [],
          comments: [],
          isPremium: false,
          publisher: {
            username: "publisher1",
            name: "Publisher One",
            imageUrl: "publisher1-image.jpg"
          }
        },
        {
          id: "2",
          content: "Second test post",
          date: Date.now() - 86400000, // 1 day ago
          likes: [],
          comments: [],
          isPremium: false,
          publisher: {
            username: "publisher2",
            name: "Publisher Two",
            imageUrl: "publisher2-image.jpg"
          }
        }
      ]
    }
    return selector(mockState)
  })
}))

// Mock the Post component
vi.mock("@/components", () => ({
  Post: ({ post }: { post: PostModel }) => (
    <div data-testid="post-component" data-post-id={post.id}>
      {post.content}
    </div>
  )
}))

// Mock the EmptyPage component
vi.mock("@/pages/EmptyPage", () => ({
  EmptyPage: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="empty-page" className={className}>
      {children}
    </div>
  )
}))

// Create a mock store
const mockStore = {
  getState: () => ({
    posts: [
      {
        id: "1",
        content: "First test post",
        date: Date.now(),
        likes: [],
        comments: [],
        isPremium: false,
        publisher: {
          username: "publisher1",
          name: "Publisher One",
          imageUrl: "publisher1-image.jpg"
        }
      },
      {
        id: "2",
        content: "Second test post",
        date: Date.now() - 86400000, // 1 day ago
        likes: [],
        comments: [],
        isPremium: false,
        publisher: {
          username: "publisher2",
          name: "Publisher Two",
          imageUrl: "publisher2-image.jpg"
        }
      }
    ]
  }),
  subscribe: vi.fn(),
  dispatch: vi.fn()
}

describe("SuggestionsPosts Component", () => {
  test("renders all posts sorted by date", () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <SuggestionsPosts />
        </BrowserRouter>
      </Provider>
    )

    // Check if all posts are rendered
    const postComponents = screen.getAllByTestId("post-component")
    expect(postComponents.length).toBe(2)

    // Verify the posts are displayed in the correct order (newest first)
    const postContents = postComponents.map((post) => post.textContent)
    expect(postContents[0]).toBe("First test post") // Newest post should be first
    expect(postContents[1]).toBe("Second test post") // Older post should be second
  })

  test("renders empty page when no posts exist", () => {
    // Override the mock to return no posts
    vi.mocked(useAppSelector).mockImplementationOnce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (selector: (state: any) => any) => {
        const mockState = {
          posts: []
        }
        return selector(mockState)
      }
    )

    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Provider store={mockStore as any}>
        <BrowserRouter>
          <SuggestionsPosts />
        </BrowserRouter>
      </Provider>
    )

    // Check if the empty page is rendered
    expect(screen.getByTestId("empty-page")).toBeInTheDocument()
    expect(screen.getByText("There are no posts yet")).toBeInTheDocument()
  })
})
