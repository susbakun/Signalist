import { backendUrl } from "@/shared/constants"
import { CommentModel, PostModel } from "@/shared/models"
import { SimplifiedAccountType } from "@/shared/types"

const POSTS_ENDPOINT = `${backendUrl}/posts`

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Something went wrong")
  }
  return response.json()
}

// Get all posts
export const fetchPosts = async (
  page = 1,
  limit = 10,
  tagName = ""
): Promise<{
  data: PostModel[]
  totalCount: number
  hasMore: boolean
}> => {
  const response = await fetch(`${POSTS_ENDPOINT}?page=${page}&limit=${limit}&tagName=${tagName}`, {
    credentials: "include"
  })
  const data = await handleResponse(response)
  return {
    data: data.data,
    totalCount: data.totalCount || data.data.length,
    hasMore: data.hasMore || data.data.length >= limit
  }
}

// Get a single post by ID
export const fetchPostById = async (id: string): Promise<PostModel> => {
  const response = await fetch(`${POSTS_ENDPOINT}/${id}`, {
    credentials: "include"
  })
  const data = await handleResponse(response)
  return data.data
}

// Create a new post
export const createPost = async (postData: {
  content: string
  isPremium: boolean
  publisher: SimplifiedAccountType
  postImageHref?: string
}): Promise<PostModel> => {
  const response = await fetch(POSTS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(postData)
  })
  const data = await handleResponse(response)
  return data.data
}

// Edit a post
export const editPost = async (
  postId: string,
  updateData: {
    content: string
    postImageHref?: string
    removePostImage?: boolean
  }
): Promise<PostModel> => {
  const response = await fetch(`${POSTS_ENDPOINT}/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(updateData)
  })
  const data = await handleResponse(response)
  return data.data
}

// Remove a post
export const removePost = async (id: string): Promise<void> => {
  const response = await fetch(`${POSTS_ENDPOINT}/${id}`, {
    method: "DELETE",
    credentials: "include"
  })
  await handleResponse(response)
}

// Like a post
export const likePost = async (postId: string, user: SimplifiedAccountType): Promise<PostModel> => {
  const response = await fetch(`${POSTS_ENDPOINT}/${postId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ user })
  })
  const data = await handleResponse(response)
  return data.data
}

// Dislike a post
export const dislikePost = async (
  postId: string,
  user: SimplifiedAccountType
): Promise<PostModel> => {
  const response = await fetch(`${POSTS_ENDPOINT}/${postId}/dislike`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ user })
  })
  const data = await handleResponse(response)
  return data.data
}

// Add a comment to a post
export const postComment = async (
  postId: string,
  commentData: {
    body: string
    publisher: SimplifiedAccountType
  }
): Promise<CommentModel> => {
  const response = await fetch(`${POSTS_ENDPOINT}/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(commentData)
  })
  const data = await handleResponse(response)
  return data.data
}

// Delete a comment
export const deleteComment = async (postId: string, commentId: string): Promise<void> => {
  const response = await fetch(`${POSTS_ENDPOINT}/${postId}/comments/${commentId}`, {
    method: "DELETE",
    credentials: "include"
  })
  await handleResponse(response)
}

// Like a comment
export const likeComment = async (
  postId: string,
  commentId: string,
  user: SimplifiedAccountType
): Promise<CommentModel> => {
  const response = await fetch(`${POSTS_ENDPOINT}/${postId}/comments/${commentId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ user })
  })
  const data = await handleResponse(response)
  return data.data
}

// Dislike a comment
export const dislikeComment = async (
  postId: string,
  commentId: string,
  user: SimplifiedAccountType
): Promise<CommentModel> => {
  const response = await fetch(`${POSTS_ENDPOINT}/${postId}/comments/${commentId}/dislike`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ user })
  })
  const data = await handleResponse(response)
  return data.data
}

// Upload image for post
export const uploadPostImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${backendUrl}/upload/posts`, {
    method: "POST",
    credentials: "include",
    body: formData
  })

  if (!response.ok) {
    throw new Error("Failed to upload image")
  }

  const data = await response.json()
  return data.url
}
