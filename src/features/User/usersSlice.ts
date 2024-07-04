import { usersMock } from "@/assets/mocks"
import { RootState, SimplifiedAccountType } from "@/shared/types"
import { createSlice } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"

const initialState = usersMock

const usersSlice = createSlice({
  name: "users",
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
    },
    updateUserScore: (state, action) => {
      return state.map((user) => {
        if (user.username === action.payload.username) {
          return {
            ...user,
            score: action.payload.score
          }
        }
        return user
      })
    },
    blockUser: (state, action) => {
      return state.map((user) => {
        if (user.username === action.payload.blockerUsername) {
          const { name, username, imageUrl }: SimplifiedAccountType = state.find(
            (user) => user.username === action.payload.blockedUsername
          )!
          const blockedUser = { name, username, imageUrl }
          return {
            ...user,
            blockedAccounts: [...user.blockedAccounts, blockedUser]
          }
        }
        return user
      })
    }
  }
})

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const { followUser, unfollowUser, updateUserScore, blockUser } = usersSlice.actions
export default usersSlice.reducer
