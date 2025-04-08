import postsReducer, {
  createPost,
  dislikeComment,
  dislikePost,
  editPost,
  likeComment,
  likePost,
  postComment,
  removePostFromInterests
} from "@/features/Post/postsSlice"
import { PostModel } from "@/shared/models"
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

  const initialState: PostModel[] = [
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
  ]

  test("should handle initial state", () => {
    expect(postsReducer(undefined, { type: "unknown" })).toEqual(expect.any(Array))
  })

  test("should handle createPost", () => {
    const newPost = {
      content: "New post content",
      isPremium: false,
      publisher: mockUser
    }

    const action = createPost(newPost)
    const state = postsReducer(initialState, action)

    expect(state.length).toBe(2)
    expect(state[1]).toEqual({
      id: "mocked-uuid",
      content: "New post content",
      date: expect.any(Number),
      likes: [],
      comments: [],
      isPremium: false,
      publisher: mockUser
    })
  })

  test("should handle createPost with image", () => {
    const newPost = {
      content: "New post with image",
      isPremium: false,
      publisher: mockUser,
      postImageId: "image-123"
    }

    const action = createPost(newPost)
    const state = postsReducer(initialState, action)

    expect(state.length).toBe(2)
    expect(state[1]).toEqual({
      id: "mocked-uuid",
      content: "New post with image",
      date: expect.any(Number),
      likes: [],
      comments: [],
      isPremium: false,
      publisher: mockUser,
      postImageId: "image-123"
    })
  })

  test("should handle removePostFromInterests", () => {
    const action = removePostFromInterests({ id: "1" })
    const state = postsReducer(initialState, action)

    expect(state.length).toBe(0)
  })

  test("should handle likePost", () => {
    const action = likePost({ postId: "1", user: mockUser })
    const state = postsReducer(initialState, action)

    expect(state[0].likes).toContainEqual(mockUser)
  })

  test("should not add duplicate likes", () => {
    // First like
    let state = postsReducer(initialState, likePost({ postId: "1", user: mockUser }))

    // Try to like again with same user
    state = postsReducer(state, likePost({ postId: "1", user: mockUser }))

    // Should still only have one like
    expect(state[0].likes.length).toBe(1)
  })

  test("should handle dislikePost", () => {
    // First add a like
    let state = postsReducer(initialState, likePost({ postId: "1", user: mockUser }))

    // Then remove it
    const action = dislikePost({ postId: "1", user: mockUser })
    state = postsReducer(state, action)

    expect(state[0].likes).not.toContainEqual(mockUser)
    expect(state[0].likes.length).toBe(0)
  })

  test("should handle postComment", () => {
    const comment = {
      postId: "1",
      body: "Test comment",
      publisher: mockUser
    }

    const action = postComment(comment)
    const state = postsReducer(initialState, action)

    expect(state[0].comments.length).toBe(1)
    expect(state[0].comments[0]).toEqual({
      commentId: "mocked-uuid",
      postId: "1",
      body: "Test comment",
      publisher: mockUser,
      date: expect.any(Number),
      likes: []
    })
  })

  test("should handle likeComment", () => {
    // First add a comment
    let state = postsReducer(
      initialState,
      postComment({
        postId: "1",
        body: "Test comment",
        publisher: mockUser
      })
    )

    // Then like the comment
    const action = likeComment({
      postId: "1",
      commentId: "mocked-uuid",
      user: mockUser
    })
    state = postsReducer(state, action)

    const comment = state[0].comments.find((c) => c.commentId === "mocked-uuid")
    expect(comment).toBeDefined()
    expect(comment!.likes).toContainEqual(mockUser)
  })

  test("should handle dislikeComment", () => {
    // First add a comment and like it
    let state = postsReducer(
      initialState,
      postComment({
        postId: "1",
        body: "Test comment",
        publisher: mockUser
      })
    )

    state = postsReducer(
      state,
      likeComment({
        postId: "1",
        commentId: "mocked-uuid",
        user: mockUser
      })
    )

    // Then dislike the comment
    const action = dislikeComment({
      postId: "1",
      commentId: "mocked-uuid",
      user: mockUser
    })
    state = postsReducer(state, action)

    const comment = state[0].comments.find((c) => c.commentId === "mocked-uuid")
    expect(comment).toBeDefined()
    expect(comment!.likes).not.toContainEqual(mockUser)
    expect(comment!.likes.length).toBe(0)
  })

  test("should handle editPost", () => {
    const action = editPost({
      postId: "1",
      content: "Updated content"
    })
    const state = postsReducer(initialState, action)

    expect(state[0].content).toBe("Updated content")
    expect(state[0].date).not.toBe(1625097600000) // Date should be updated
  })

  test("should handle editPost with image", () => {
    const action = editPost({
      postId: "1",
      content: "Updated content with image",
      postImageId: "new-image-123"
    })
    const state = postsReducer(initialState, action)

    expect(state[0].content).toBe("Updated content with image")
    expect(state[0].postImageId).toBe("new-image-123")
  })

  test("should handle editPost with image removal", () => {
    // First add an image to the post
    let state = postsReducer(
      initialState,
      editPost({
        postId: "1",
        content: "Post with image",
        postImageId: "image-123"
      })
    )

    // Then remove the image
    const action = editPost({
      postId: "1",
      content: "Post without image",
      removePostImage: true
    })
    state = postsReducer(state, action)

    expect(state[0].content).toBe("Post without image")
    expect(state[0].postImageId).toBe("") // Image should be removed
  })
})
