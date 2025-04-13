import { PostModel } from "@/shared/models"
import { RootState, SimplifiedAccountType } from "@/shared/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import * as postsApi from "@/services/postsApi"

// Define async thunks for API operations
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    return await postsApi.fetchPosts(page, limit)
  }
)

export const createPostAsync = createAsyncThunk(
  "posts/createPost",
  async (postData: {
    content: string
    isPremium: boolean
    publisher: SimplifiedAccountType
    postImageHref?: string
  }) => {
    return await postsApi.createPost(postData)
  }
)

export const editPostAsync = createAsyncThunk(
  "posts/editPost",
  async (data: {
    postId: string
    content: string
    postImageHref?: string
    removePostImage?: boolean
  }) => {
    return await postsApi.editPost(data.postId, {
      content: data.content,
      postImageHref: data.postImageHref,
      removePostImage: data.removePostImage
    })
  }
)

export const removePostAsync = createAsyncThunk("posts/removePost", async (id: string) => {
  await postsApi.removePost(id)
  return id
})

export const likePostAsync = createAsyncThunk(
  "posts/likePost",
  async (data: { postId: string; user: SimplifiedAccountType }) => {
    return await postsApi.likePost(data.postId, data.user)
  }
)

export const dislikePostAsync = createAsyncThunk(
  "posts/dislikePost",
  async (data: { postId: string; user: SimplifiedAccountType }) => {
    return await postsApi.dislikePost(data.postId, data.user)
  }
)

export const postCommentAsync = createAsyncThunk(
  "posts/postComment",
  async (data: { postId: string; body: string; publisher: SimplifiedAccountType }) => {
    const comment = await postsApi.postComment(data.postId, {
      body: data.body,
      publisher: data.publisher
    })
    return { postId: data.postId, comment }
  }
)

export const deleteCommentAsync = createAsyncThunk(
  "posts/deleteComment",
  async (data: { postId: string; commentId: string }) => {
    await postsApi.deleteComment(data.postId, data.commentId)
    return data
  }
)

export const likeCommentAsync = createAsyncThunk(
  "posts/likeComment",
  async (data: { postId: string; commentId: string; user: SimplifiedAccountType }) => {
    const updatedComment = await postsApi.likeComment(data.postId, data.commentId, data.user)
    return { postId: data.postId, commentId: data.commentId, updatedComment }
  }
)

export const dislikeCommentAsync = createAsyncThunk(
  "posts/dislikeComment",
  async (data: { postId: string; commentId: string; user: SimplifiedAccountType }) => {
    const updatedComment = await postsApi.dislikeComment(data.postId, data.commentId, data.user)
    return { postId: data.postId, commentId: data.commentId, updatedComment }
  }
)

// Add a new action to update post publishers when a user profile is updated
export const updatePostPublishersAsync = createAsyncThunk(
  "posts/updatePostPublishers",
  async (userData: SimplifiedAccountType) => {
    return userData
  }
)

// Define the state type
interface PostsState {
  posts: PostModel[]
  loading: boolean
  error: string | null
  page: number
  hasMore: boolean
  totalCount: number
}

// Initial state now includes loading and error states
const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
  totalCount: 0
}

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Keep empty reducers object for potential synchronous actions in the future
    updatePage: (state, action) => {
      state.page = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false
        if (state.page === 1) {
          state.posts = action.payload.data
        } else {
          // Check for duplicates before adding new posts
          const existingPostIds = new Set(state.posts.map((post) => post.id))
          const newPosts = action.payload.data.filter((post) => !existingPostIds.has(post.id))

          // Only add posts that don't already exist
          state.posts = [...state.posts, ...newPosts]

          // If we got no new posts, we've reached the end
          if (newPosts.length === 0) {
            state.hasMore = false
          } else {
            state.hasMore = action.payload.hasMore
          }
        }
        state.totalCount = action.payload.totalCount
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch posts"
      })

      // Create post
      .addCase(createPostAsync.fulfilled, (state, action) => {
        state.posts.push(action.payload)
      })

      // Edit post
      .addCase(editPostAsync.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post.id === action.payload.id)
        if (index !== -1) {
          state.posts[index] = action.payload
        }
      })

      // Remove post
      .addCase(removePostAsync.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload)
      })

      // Like post
      .addCase(likePostAsync.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post.id === action.payload.id)
        if (index !== -1) {
          state.posts[index] = action.payload
        }
      })

      // Dislike post
      .addCase(dislikePostAsync.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post.id === action.payload.id)
        if (index !== -1) {
          state.posts[index] = action.payload
        }
      })

      // Post comment
      .addCase(postCommentAsync.fulfilled, (state, action) => {
        const { postId, comment } = action.payload
        const postIndex = state.posts.findIndex((post) => post.id === postId)
        if (postIndex !== -1) {
          state.posts[postIndex].comments.push(comment)
        }
      })

      // Delete comment
      .addCase(deleteCommentAsync.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload
        const postIndex = state.posts.findIndex((post) => post.id === postId)
        if (postIndex !== -1) {
          state.posts[postIndex].comments = state.posts[postIndex].comments.filter(
            (comment) => comment.commentId !== commentId
          )
        }
      })

      // Like comment
      .addCase(likeCommentAsync.fulfilled, (state, action) => {
        const { postId, commentId, updatedComment } = action.payload
        const postIndex = state.posts.findIndex((post) => post.id === postId)
        if (postIndex !== -1) {
          const commentIndex = state.posts[postIndex].comments.findIndex(
            (comment) => comment.commentId === commentId
          )
          if (commentIndex !== -1) {
            state.posts[postIndex].comments[commentIndex] = updatedComment
          }
        }
      })

      // Dislike comment
      .addCase(dislikeCommentAsync.fulfilled, (state, action) => {
        const { postId, commentId, updatedComment } = action.payload
        const postIndex = state.posts.findIndex((post) => post.id === postId)
        if (postIndex !== -1) {
          const commentIndex = state.posts[postIndex].comments.findIndex(
            (comment) => comment.commentId === commentId
          )
          if (commentIndex !== -1) {
            state.posts[postIndex].comments[commentIndex] = updatedComment
          }
        }
      })

      // Update post publishers
      .addCase(updatePostPublishersAsync.fulfilled, (state, action) => {
        // Update publisher info in all posts and comments where this user is the publisher
        state.posts = state.posts.map((post) => {
          // If this post was published by the updated user
          if (post.publisher.username === action.payload.username) {
            // Update the publisher info
            post.publisher = action.payload
          }

          // Also update publisher info in comments
          post.comments = post.comments.map((comment) => {
            if (comment.publisher.username === action.payload.username) {
              comment.publisher = action.payload
            }
            return comment
          })

          return post
        })
      })
  }
})

// Export the typed selector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// Export the reducer as the default export
export default postsSlice.reducer

// Export actions
export const { updatePage } = postsSlice.actions
