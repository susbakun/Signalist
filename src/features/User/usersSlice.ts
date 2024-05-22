import { usersMock } from '@/assets/mocks'
import { RootState } from '@/shared/types'
import { createSlice } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'

const initialState = usersMock

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    followUser: (state, action) => {
      const follower = state.find((user) => user.username === action.payload.followerUsername)
      const following = state.find((user) => user.username === action.payload.followingUsername)
      if (follower && following)
        return state.map((user) => {
          if (user.username === action.payload.followerUsername) {
            return {
              ...user,
              followings: [...user.followings, following]
            }
          } else if (user.username === action.payload.followingUsername) {
            return {
              ...user,
              followers: [...user.followers, follower]
            }
          }
          return user
        })
    },
    unfollowUser: (state, action) => {
      return state.map((user) => {
        if (user.username === action.payload.followerUsername) {
          return {
            ...user,
            followings: user.followings.filter(
              (following) => following.username !== action.payload.followingUsername
            )
          }
        } else if (user.username === action.payload.followingUsername) {
          return {
            ...user,
            followers: user.followers.filter(
              (follower) => follower.username !== action.payload.followerUsername
            )
          }
        }
        return user
      })
    }
  }
})

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const { followUser, unfollowUser } = usersSlice.actions
export default usersSlice.reducer
