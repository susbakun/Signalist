import postsReducer, {
  createPostAsync,
  dislikeCommentAsync,
  dislikePostAsync,
  editPostAsync,
  likeCommentAsync,
  likePostAsync,
  postCommentAsync
} from "@/features/Post/postsSlice"
import { SimplifiedAccountType } from "@/shared/types"
import { vi } from "vitest"

// Mock uuid generation
vi.mock("uuid", () => ({
  v4: vi.fn().mockReturnValue("mocked-uuid")
}))

describe("postsSlice", () => {
  const mockUser: SimplifiedAccountType = {
    username: "testuser",
    name: "Test User",
    imageUrl: "test-image.jpg"
  }

  const initialState = {
    posts: [
      {
        id: "1",
        content: "Test post content",
        date: 1625097600000, // Fixed date for testing
        likes: [],
        comments: [],
        isPremium: false,
        publisher: {
          username: "publisher",
          name: "Publisher Name",
          imageUrl: "publisher-image.jpg"
        }
      }
    ],
    loading: false,
    error: null
  }

  test("should handle initial state", () => {
    expect(postsReducer(undefined, { type: "unknown" })).toEqual({
      posts: [],
      loading: false,
      error: null
    })
  })

  test("should handle createPostAsync.fulfilled", () => {
    const action = {
      type: createPostAsync.fulfilled.type,
      payload: {
        id: "mocked-uuid",
        content: "New post content",
        date: expect.any(Number),
        likes: [],
        comments: [],
        isPremium: false,
        publisher: mockUser
      }
    }
    const state = postsReducer(initialState, action)

    expect(state.posts.length).toBe(2)
    expect(state.posts[1]).toEqual(action.payload)
  })

  test("should handle createPostAsync.fulfilled with image", () => {
    const action = {
      type: createPostAsync.fulfilled.type,
      payload: {
        id: "mocked-uuid",
        content: "New post with image",
        date: expect.any(Number),
        likes: [],
        comments: [],
        isPremium: false,
        publisher: mockUser,
        postImageHref: "https://example.com/image-123.jpg"
      }
    }
    const state = postsReducer(initialState, action)

    expect(state.posts.length).toBe(2)
    expect(state.posts[1]).toEqual(action.payload)
  })

  test("should handle likePostAsync.fulfilled", () => {
    const action = {
      type: likePostAsync.fulfilled.type,
      payload: {
        postId: "1",
        likes: [mockUser]
      }
    }
    const state = postsReducer(initialState, action)

    expect(state.posts[0].likes).toContainEqual(mockUser)
  })

  test("should handle dislikePostAsync.fulfilled", () => {
    const action = {
      type: dislikePostAsync.fulfilled.type,
      payload: {
        postId: "1",
        likes: []
      }
    }
    const state = postsReducer(initialState, action)

    expect(state.posts[0].likes).not.toContainEqual(mockUser)
    expect(state.posts[0].likes.length).toBe(0)
  })

  test("should handle postCommentAsync.fulfilled", () => {
    const action = {
      type: postCommentAsync.fulfilled.type,
      payload: {
        postId: "1",
        comment: {
          commentId: "mocked-uuid",
          postId: "1",
          body: "Test comment",
          publisher: mockUser,
          date: expect.any(Number),
          likes: []
        }
      }
    }
    const state = postsReducer(initialState, action)

    expect(state.posts[0].comments.length).toBe(1)
    expect(state.posts[0].comments[0]).toEqual(action.payload.comment)
  })

  test("should handle likeCommentAsync.fulfilled", () => {
    const action = {
      type: likeCommentAsync.fulfilled.type,
      payload: {
        postId: "1",
        commentId: "mocked-uuid",
        likes: [mockUser]
      }
    }
    const state = postsReducer(initialState, action)

    const comment = state.posts[0].comments.find((c) => c.commentId === "mocked-uuid")
    expect(comment).toBeDefined()
    expect(comment!.likes).toContainEqual(mockUser)
  })

  test("should handle dislikeCommentAsync.fulfilled", () => {
    const action = {
      type: dislikeCommentAsync.fulfilled.type,
      payload: {
        postId: "1",
        commentId: "mocked-uuid",
        likes: []
      }
    }
    const state = postsReducer(initialState, action)

    const comment = state.posts[0].comments.find((c) => c.commentId === "mocked-uuid")
    expect(comment).toBeDefined()
    expect(comment!.likes).not.toContainEqual(mockUser)
    expect(comment!.likes.length).toBe(0)
  })

  test("should handle editPostAsync.fulfilled", () => {
    const action = {
      type: editPostAsync.fulfilled.type,
      payload: {
        postId: "1",
        content: "Updated content",
        date: expect.any(Number)
      }
    }
    const state = postsReducer(initialState, action)

    expect(state.posts[0].content).toBe("Updated content")
    expect(state.posts[0].date).not.toBe(1625097600000) // Date should be updated
  })

  test("should handle editPostAsync.fulfilled with image", () => {
    const action = {
      type: editPostAsync.fulfilled.type,
      payload: {
        postId: "1",
        content: "Updated content with image",
        postImageHref: "https://example.com/new-image-123.jpg",
        date: expect.any(Number)
      }
    }
    const state = postsReducer(initialState, action)

    expect(state.posts[0].content).toBe("Updated content with image")
    expect(state.posts[0].postImageHref).toBe("https://example.com/new-image-123.jpg")
  })

  test("should handle loading states", () => {
    const loadingAction = {
      type: createPostAsync.pending.type
    }
    const loadingState = postsReducer(initialState, loadingAction)
    expect(loadingState.loading).toBe(true)

    const errorAction = {
      type: createPostAsync.rejected.type,
      error: { message: "Failed to create post" }
    }
    const errorState = postsReducer(loadingState, errorAction)
    expect(errorState.loading).toBe(false)
    expect(errorState.error).toBe("Failed to create post")
  })
})
