import { usersMock } from "@/assets/mocks"
import { AccountModel, SignalModel } from "@/shared/models"
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
      const currentTime = new Date().getTime()
      const signal: SignalModel = action.payload.signal

      return state.map((user) => {
        const updatedScoreUser: AccountModel = { ...user }
        if (user.username === signal.publisher.username) {
          const isSignalRecentlyClosed =
            currentTime - signal.closeTime >= 0 && currentTime - signal.closeTime <= 70000

          if (isSignalRecentlyClosed) {
            console.log("first")
            signal.targets.forEach((target) => {
              console.log(target)
              if (target.touched) {
                updatedScoreUser.score += 1
              }
            })
          }
        }
        return updatedScoreUser
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
            blockedAccounts: [...user.blockedAccounts, blockedUser],
            followers: [...user.followers.filter((user) => user.username !== username)],
            followings: [...user.followings.filter((user) => user.username !== username)]
          }
        }
        return user
      })
    },
    bookmarkPost: (state, action) => {
      return state.map((user) => {
        if (user.username === action.payload.userUsername) {
          const updatedBookmarkedPostsList = [...user.bookmarks.posts]
          updatedBookmarkedPostsList.push(action.payload.post)
          return {
            ...user,
            bookmarks: { signals: user.bookmarks.signals, posts: updatedBookmarkedPostsList }
          }
        } else {
          return user
        }
      })
    },
    unBookmarkPost: (state, action) => {
      return state.map((user) => {
        if (user.username === action.payload.userUsername) {
          const updatedBookmarkedPostsList = [
            ...user.bookmarks.posts.filter(
              (bookmarkedPost) => bookmarkedPost.id !== action.payload.postId
            )
          ]
          return {
            ...user,
            bookmarks: { signals: user.bookmarks.signals, posts: updatedBookmarkedPostsList }
          }
        } else {
          return user
        }
      })
    },
    bookmarkSignal: (state, action) => {
      return state.map((user) => {
        if (user.username === action.payload.userUsername) {
          const updatedBookmarkedSignalsList = [...user.bookmarks.signals]
          updatedBookmarkedSignalsList.push(action.payload.signal)
          return {
            ...user,
            bookmarks: { signals: updatedBookmarkedSignalsList, posts: user.bookmarks.posts }
          }
        } else {
          return user
        }
      })
    },
    unBookmarkSignal: (state, action) => {
      return state.map((user) => {
        if (user.username === action.payload.userUsername) {
          const updatedBookmarkedSignalsList = [
            ...user.bookmarks.signals.filter(
              (bookmarkedSignal) => bookmarkedSignal.id !== action.payload.signalId
            )
          ]
          return {
            ...user,
            bookmarks: { signals: updatedBookmarkedSignalsList, posts: user.bookmarks.posts }
          }
        } else {
          return user
        }
      })
    }
  }
})

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const {
  followUser,
  unfollowUser,
  updateUserScore,
  blockUser,
  bookmarkPost,
  bookmarkSignal,
  unBookmarkSignal,
  unBookmarkPost
} = usersSlice.actions
export default usersSlice.reducer
