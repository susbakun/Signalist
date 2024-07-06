import { postsMock } from "@/assets/mocks"
import { CommentModel, PostModel } from "@/shared/models"
import { RootState, SimplifiedAccountType } from "@/shared/types"
import { createSlice } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import { v4 } from "uuid"

const initialState = postsMock

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    createPost: (state, action) => {
      const newPost: PostModel = {
        id: v4(),
        isPremium: action.payload.isPremium,
        content: action.payload.content,
        likes: [],
        publisher: action.payload.publisher,
        date: new Date().getTime(),
        comments: []
      }
      if (action.payload.postImageId) {
        newPost.postImageId = action.payload.postImageId
      }
      state.push(newPost)
    },
    removePostFromInterests: (state, action) => {
      return state.filter((post) => post.id !== action.payload.id)
    },
    likePost: (state, action) => {
      return state.map((post) => {
        if (post.id === action.payload.postId) {
          if (post.likes.every((user) => user.username !== action.payload.user.username)) {
            const newLikesList: SimplifiedAccountType[] = [...post.likes, action.payload.user]
            return { ...post, likes: newLikesList }
          }
        }
        return post
      })
    },
    dislikePost: (state, action) => {
      return state.map((post) => {
        if (post.id === action.payload.postId) {
          if (post.likes.some((user) => user.username === action.payload.user.username)) {
            const newLikesList: SimplifiedAccountType[] = post.likes.filter(
              (user) => user.username !== action.payload.user.username
            )
            return { ...post, likes: newLikesList }
          }
        }
        return post
      })
    },
    postComment: (state, action) => {
      return state.map((post) => {
        if (post.id === action.payload.postId) {
          const postComments = [...post.comments]
          const newComment: CommentModel = {
            body: action.payload.body,
            commentId: v4(),
            date: new Date().getTime(),
            likes: [],
            postId: action.payload.postId,
            publisher: action.payload.publisher
          }
          postComments.push(newComment)
          return { ...post, comments: postComments }
        }
        return post
      })
    },

    deleteComment: (state, action) => {
      return state.map((post) => {
        if (post.id === action.payload.postId) {
          const updatedCommentPost = post.comments.filter(
            (comment) => comment.commentId !== action.payload.commentId
          )
          return { ...post, comments: updatedCommentPost }
        }
        return post
      })
    },
    likeComment: (state, action) => {
      return state.map((post) => {
        if (post.id === action.payload.postId) {
          const likedComment: CommentModel = post.comments.find(
            (commnet) => commnet.commentId === action.payload.commentId
          )!
          const updatedCommentPost = [...likedComment.likes, action.payload.user]
          return { ...post, comments: [...post.comments, ...updatedCommentPost] }
        }
        return post
      })
    },
    dislikeComment: (state, action) => {
      return state.map((post) => {
        if (post.id === action.payload.postId) {
          const dislikedComment: CommentModel = post.comments.find(
            (commnet) => commnet.commentId === action.payload.commendId
          )!
          const updatedCommentPost: CommentModel = {
            ...dislikedComment,
            likes: [
              ...dislikedComment.likes.filter(
                (user) => user.username !== action.payload.user.username
              )
            ]
          }
          return { ...post, comments: [...post.comments, updatedCommentPost] }
        }
        return post
      })
    },
    editPost: (state, action) => {
      return state.map((post) => {
        if (post.id === action.payload.postId) {
          const editedPost: PostModel = {
            ...post,
            content: action.payload.content,
            date: new Date().getTime()
          }
          if (action.payload.postImageId) {
            editedPost.postImageId = action.payload.postImageId
          }
          if (action.payload.removePostImage) {
            editedPost.postImageId = ""
          }
          return editedPost
        }
        return post
      })
    }
  }
})

export const {
  createPost,
  removePostFromInterests,
  likePost,
  dislikePost,
  likeComment,
  editPost,
  postComment,
  dislikeComment,
  deleteComment
} = postsSlice.actions
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default postsSlice.reducer
