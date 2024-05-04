import { postsMock } from '@/assets/mocks'
import { PostModel } from '@/shared/models'
import { RootState } from '@/shared/types'
import { createSlice } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { v4 } from 'uuid'

const initialState = postsMock

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    createPost: (state, action) => {
      const newPost: PostModel = {
        id: v4(),
        content: action.payload.content,
        likes: 0,
        publisher: action.payload.publisher,
        date: new Date().getTime(),
        comments: []
      }
      state.push(newPost)
    },
    deletePost: (state, action) => {
      return state.filter((post) => post.id !== action.payload.id)
    },
    blockUser: (state, action) => {
      return state.filter((post) => post.publisher.username !== action.payload.username)
    },
    likePost: (state, action) => {
      return state.map((post) => {
        if (post.id === action.payload.id) {
          return { ...post, likes: post.likes - 1 }
        }
        return post
      })
    },
    dislikePost: (state, action) => {
      return state.map((post) => {
        if (post.id === action.payload.id) {
          return { ...post, likes: post.likes + 1 }
        }
        return post
      })
    }
  }
})

export const { createPost, deletePost, blockUser, likePost, dislikePost } = postsSlice.actions
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default postsSlice.reducer
