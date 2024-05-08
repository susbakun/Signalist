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
        state = state.map((user) => {
          if (user.username === follower.username) {
            follower.followings.push(following.username)
            return follower
          } else if (user.username === following.username) {
            following.followers.push(follower.username)
            return following
          }
          return user
        })
    },
    unfollowUser: (state, action) => {
      const follower = state.find((user) => user.username === action.payload.followerUsername)
      const following = state.find((user) => user.username === action.payload.followingUsername)
      if (follower && following)
        state = state.map((user) => {
          if (user.username === follower.username) {
            follower.followings = follower.followings.filter(
              (username) => username !== following.username
            )
            return follower
          } else if (user.username === following.username) {
            following.followers = following.followers.filter(
              (username) => username !== follower.username
            )
            return following
          }
          return user
        })
    }
  }
})

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const { followUser, unfollowUser } = usersSlice.actions
export default usersSlice.reducer
