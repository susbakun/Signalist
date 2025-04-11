import postsReducer, {
  createPostAsync,
  dislikeCommentAsync,
  dislikePostAsync,
  editPostAsync,
  likeCommentAsync,
  likePostAsync,
  postCommentAsync,
  updatePage
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
    error: null,
    page: 1,
    hasMore: true,
    totalCount: 1
  }

  test("should handle initial state", () => {
    expect(postsReducer(undefined, { type: "unknown" })).toEqual({
      posts: [],
      loading: false,
      error: null,
      page: 1,
      hasMore: true,
      totalCount: 0
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
        id: "1",
        content: "Test post content",
        date: 1625097600000,
        likes: [mockUser],
        comments: [],
        isPremium: false,
        publisher: {
          username: "publisher",
          name: "Publisher Name",
          imageUrl: "publisher-image.jpg"
        }
      }
    }
    const state = postsReducer(initialState, action)

    expect(state.posts[0].likes).toContainEqual(mockUser)
  })

  test("should handle dislikePostAsync.fulfilled", () => {
    // First add a like
    const initialStateWithLike = {
      ...initialState,
      posts: [
        {
          ...initialState.posts[0],
          likes: [mockUser]
        }
      ]
    }

    const action = {
      type: dislikePostAsync.fulfilled.type,
      payload: {
        id: "1",
        content: "Test post content",
        date: 1625097600000,
        likes: [],
        comments: [],
        isPremium: false,
        publisher: {
          username: "publisher",
          name: "Publisher Name",
          imageUrl: "publisher-image.jpg"
        }
      }
    }
    const state = postsReducer(initialStateWithLike, action)

    expect(state.posts[0].likes).not.toContainEqual(mockUser)
    expect(state.posts[0].likes.length).toBe(0)
  })

  test("should handle postCommentAsync.fulfilled", () => {
    const newComment = {
      commentId: "mocked-uuid",
      postId: "1",
      body: "Test comment",
      publisher: mockUser,
      date: expect.any(Number),
      likes: []
    }

    const action = {
      type: postCommentAsync.fulfilled.type,
      payload: {
        postId: "1",
        comment: newComment
      }
    }
    const state = postsReducer(initialState, action)

    expect(state.posts[0].comments.length).toBe(1)
    expect(state.posts[0].comments[0]).toEqual(newComment)
  })

  test("should handle likeCommentAsync.fulfilled", () => {
    // First add a comment
    const stateWithComment = {
      ...initialState,
      posts: [
        {
          ...initialState.posts[0],
          comments: [
            {
              commentId: "mocked-uuid",
              postId: "1",
              body: "Test comment",
              publisher: mockUser,
              date: 1625097600000,
              likes: []
            }
          ]
        }
      ]
    }

    const updatedComment = {
      commentId: "mocked-uuid",
      postId: "1",
      body: "Test comment",
      publisher: mockUser,
      date: 1625097600000,
      likes: [mockUser]
    }

    const action = {
      type: likeCommentAsync.fulfilled.type,
      payload: {
        postId: "1",
        commentId: "mocked-uuid",
        updatedComment
      }
    }
    const state = postsReducer(stateWithComment, action)

    const comment = state.posts[0].comments.find((c) => c.commentId === "mocked-uuid")
    expect(comment).toBeDefined()
    expect(comment!.likes).toContainEqual(mockUser)
  })

  test("should handle dislikeCommentAsync.fulfilled", () => {
    // First add a comment with a like
    const stateWithLikedComment = {
      ...initialState,
      posts: [
        {
          ...initialState.posts[0],
          comments: [
            {
              commentId: "mocked-uuid",
              postId: "1",
              body: "Test comment",
              publisher: mockUser,
              date: 1625097600000,
              likes: [mockUser]
            }
          ]
        }
      ]
    }

    const updatedComment = {
      commentId: "mocked-uuid",
      postId: "1",
      body: "Test comment",
      publisher: mockUser,
      date: 1625097600000,
      likes: []
    }

    const action = {
      type: dislikeCommentAsync.fulfilled.type,
      payload: {
        postId: "1",
        commentId: "mocked-uuid",
        updatedComment
      }
    }
    const state = postsReducer(stateWithLikedComment, action)

    const comment = state.posts[0].comments.find((c) => c.commentId === "mocked-uuid")
    expect(comment).toBeDefined()
    expect(comment!.likes).not.toContainEqual(mockUser)
    expect(comment!.likes.length).toBe(0)
  })

  test("should handle editPostAsync.fulfilled", () => {
    const action = {
      type: editPostAsync.fulfilled.type,
      payload: {
        id: "1",
        content: "Updated content",
        date: expect.any(Number),
        likes: [],
        comments: [],
        isPremium: false,
        publisher: {
          username: "publisher",
          name: "Publisher Name",
          imageUrl: "publisher-image.jpg"
        }
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
        id: "1",
        content: "Updated content with image",
        postImageHref: "https://example.com/new-image-123.jpg",
        date: expect.any(Number),
        likes: [],
        comments: [],
        isPremium: false,
        publisher: {
          username: "publisher",
          name: "Publisher Name",
          imageUrl: "publisher-image.jpg"
        }
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

  test("should handle updatePage action", () => {
    const action = {
      type: updatePage.type,
      payload: 2
    }
    const state = postsReducer(initialState, action)
    expect(state.page).toBe(2)
  })
})
