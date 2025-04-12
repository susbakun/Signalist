import postsReducer, {
  createPostAsync,
  dislikeCommentAsync,
  dislikePostAsync,
  editPostAsync,
  fetchPosts,
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

  test("should handle fetchPosts.fulfilled", () => {
    const newPosts = [
      {
        id: "2",
        content: "New fetched post",
        date: 1625097600000,
        likes: [],
        comments: [],
        isPremium: false,
        publisher: mockUser
      }
    ]

    // Test first page (reset)
    const resetAction = {
      type: fetchPosts.fulfilled.type,
      payload: {
        data: newPosts,
        totalCount: 1,
        hasMore: false
      }
    }

    let state = postsReducer(initialState, resetAction)
    expect(state.posts).toEqual(newPosts)
    expect(state.loading).toBe(false)
    expect(state.hasMore).toBe(false)
    expect(state.totalCount).toBe(1)

    // Test pagination
    const paginationAction = {
      type: fetchPosts.fulfilled.type,
      payload: {
        data: newPosts,
        totalCount: 2,
        hasMore: true
      }
    }

    state = {
      ...initialState,
      page: 2
    }

    state = postsReducer(state, paginationAction)
    expect(state.posts.length).toBe(2)
    expect(state.totalCount).toBe(2)
    expect(state.hasMore).toBe(true)
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

  test("should handle editPostAsync.fulfilled", () => {
    const action = {
      type: editPostAsync.fulfilled.type,
      payload: {
        id: "1",
        content: "Updated post content",
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
    const state = postsReducer(initialState, action)

    expect(state.posts[0].content).toBe("Updated post content")
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
    expect(comment!.likes.length).toBe(0)
  })

  test("should handle updatePage", () => {
    const action = {
      type: updatePage.type,
      payload: 2
    }
    const state = postsReducer(initialState, action)

    expect(state.page).toBe(2)
  })
})
