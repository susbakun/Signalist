import { AccountModel, SignalModel } from "@/shared/models"
import { RootState } from "@/shared/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import * as usersApi from "@/services/usersApi"
import { updatePostPublishersAsync } from "../Post/postsSlice"
import { updateMessageSendersReceiversAsync } from "../Message/messagesSlice"
import { updateSignalPublishersAsync } from "../Signal/signalsSlice"

interface UsersState {
  users: AccountModel[]
  loading: boolean
  error: string | null
  signalsCount: number
  signalsCountLoading: boolean
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  signalsCount: 0,
  signalsCountLoading: false
}

// Async Thunks
export const fetchUsersAsync = createAsyncThunk("users/fetchUsers", async () => {
  return await usersApi.getUsers()
})

export const getUserByUsernameAsync = createAsyncThunk(
  "users/getUserByUsername",
  async (username: string) => {
    return await usersApi.getUserByUsername(username)
  }
)

export const registerUserAsync = createAsyncThunk(
  "users/registerUser",
  async (
    user: Omit<AccountModel, "followers" | "followings" | "bookmarks" | "blockedAccounts" | "score">
  ) => {
    const response = await usersApi.createUser(user)
    // No token handling needed with cookie-based auth
    return response as AccountModel
  }
)

export const loginUserAsync = createAsyncThunk(
  "users/loginUser",
  async (credentials: { email: string; password: string }) => {
    const response = await usersApi.loginUser(credentials)
    return response.user
  }
)

export const followUserAsync = createAsyncThunk(
  "users/followUser",
  async (data: { followerUsername: string; followingUsername: string }) => {
    return await usersApi.followUser(data.followerUsername, data.followingUsername)
  }
)

export const unfollowUserAsync = createAsyncThunk(
  "users/unfollowUser",
  async (data: { followerUsername: string; followingUsername: string }) => {
    return await usersApi.unfollowUser(data.followerUsername, data.followingUsername)
  }
)

export const blockUserAsync = createAsyncThunk(
  "users/blockUser",
  async (data: { blockerUsername: string; blockedUsername: string }) => {
    return await usersApi.blockUser(data.blockerUsername, data.blockedUsername)
  }
)

export const unblockUserAsync = createAsyncThunk(
  "users/unblockUser",
  async (data: { blockerUsername: string; blockedUsername: string }) => {
    return await usersApi.unblockUser(data.blockerUsername, data.blockedUsername)
  }
)

export const updateBookmarksAsync = createAsyncThunk(
  "users/updateBookmarks",
  async (data: { username: string; bookmarks: AccountModel["bookmarks"] }) => {
    return await usersApi.updateBookmarks(data.username, data.bookmarks)
  }
)

export const updateProfileAsync = createAsyncThunk(
  "users/updateProfile",
  async (
    data: {
      username: string
      updates: Partial<Pick<AccountModel, "name" | "bio" | "imageUrl" | "username" | "email">>
    },
    { dispatch, getState }
  ) => {
    const response = await usersApi.updateProfile(data.username, data.updates)

    // Get the user's current score from state
    const state = getState() as RootState
    const currentUser = state.users.users.find((user) => user.username === response.username)
    const userScore = currentUser?.score || 0

    // Create simplified account for updates to other slices
    const simplifiedAccount = {
      username: response.username,
      name: response.name,
      imageUrl: response.imageUrl || ""
    }

    // Create signal account with score included
    const signalAccount = {
      ...simplifiedAccount,
      score: userScore
    }

    // Update posts, messages, signals, and other content that references this user
    dispatch(updatePostPublishersAsync(simplifiedAccount))
    dispatch(updateMessageSendersReceiversAsync(simplifiedAccount))
    dispatch(updateSignalPublishersAsync(signalAccount))

    return response
  }
)

export const updateUserScoreAsync = createAsyncThunk(
  "users/updateUserScore",
  async (data: { signal: SignalModel }, { rejectWithValue }) => {
    try {
      return await usersApi.updateUserScore(data.signal)
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.toString() : String(error))
    }
  }
)

export const getUserSignalsCountAsync = createAsyncThunk(
  "users/getUserSignalsCount",
  async (username: string) => {
    return await usersApi.getUserSignalsCount(username)
  }
)

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetch users cases
      .addCase(fetchUsersAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch users"
      })

      // Handle get user by username cases
      .addCase(getUserByUsernameAsync.pending, (state) => {
        // Don't set global loading state to true for user fetching
        // This prevents unnecessary UI refreshes when updating scores
        state.error = null
      })
      .addCase(getUserByUsernameAsync.fulfilled, (state, action) => {
        // Update only the specific user that changed
        const index = state.users.findIndex((user) => user.username === action.payload.username)
        if (index !== -1) {
          state.users[index] = action.payload
        } else {
          state.users.push(action.payload)
        }
      })
      .addCase(getUserByUsernameAsync.rejected, (state, action) => {
        // Don't set loading to false here since we didn't set it to true in pending
        state.error = action.error.message || "Failed to fetch user"
      })

      // Handle register user cases
      .addCase(registerUserAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.loading = false
        state.users.push(action.payload)
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to register user"
      })

      // Handle login user cases
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.loading = false
        const index = state.users.findIndex((user) => user.username === action.payload.username)
        if (index !== -1) {
          state.users[index] = action.payload
        } else {
          state.users.push(action.payload)
        }
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to login"
      })

      // Handle follow user cases
      .addCase(followUserAsync.pending, (state) => {
        // Don't set global loading state to true for follow actions
        // This prevents unnecessary UI refreshes
        state.error = null
      })
      .addCase(followUserAsync.fulfilled, (state, action) => {
        // Update only the specific user that changed
        state.users = state.users.map((user) =>
          user.username === action.payload.username ? action.payload : user
        )
      })
      .addCase(followUserAsync.rejected, (state, action) => {
        state.error = action.error.message || "Failed to follow user"
      })

      // Handle unfollow user cases
      .addCase(unfollowUserAsync.pending, (state) => {
        // Don't set global loading state to true for unfollow actions
        // This prevents unnecessary UI refreshes
        state.error = null
      })
      .addCase(unfollowUserAsync.fulfilled, (state, action) => {
        // Update only the specific user that changed
        state.users = state.users.map((user) =>
          user.username === action.payload.username ? action.payload : user
        )
      })
      .addCase(unfollowUserAsync.rejected, (state, action) => {
        // Don't set loading to false here since we didn't set it to true in pending
        state.error = action.error.message || "Failed to unfollow user"
      })

      // Handle block user cases
      .addCase(blockUserAsync.pending, (state) => {
        // Don't set global loading state to true for block actions
        // This prevents unnecessary UI refreshes
        state.error = null
      })
      .addCase(blockUserAsync.fulfilled, (state, action) => {
        // Update only the specific users that changed
        state.users = state.users.map((user) => {
          // Update the blocker
          if (user.username === action.payload.username) {
            return action.payload
          }
          // Update the blocked user (removed from followings/followers)
          const blockedUsername =
            action.payload.blockedUsers[action.payload.blockedUsers.length - 1].username
          if (user.username === blockedUsername) {
            // Remove blocker from this user's followings and followers
            return {
              ...user,
              followings: user.followings.filter((u) => u.username !== action.payload.username),
              followers: user.followers.filter((u) => u.username !== action.payload.username)
            }
          }
          return user
        })
      })
      .addCase(blockUserAsync.rejected, (state, action) => {
        // Don't set loading to false here since we didn't set it to true in pending
        state.error = action.error.message || "Failed to block user"
      })

      // Handle unblock user cases
      .addCase(unblockUserAsync.pending, (state) => {
        // Don't set global loading state to true for unblock actions
        // This prevents unnecessary UI refreshes
        state.error = null
      })
      .addCase(unblockUserAsync.fulfilled, (state, action) => {
        // Update only the specific user that changed
        state.users = state.users.map((user) =>
          user.username === action.payload.username ? action.payload : user
        )
      })
      .addCase(unblockUserAsync.rejected, (state, action) => {
        // Don't set loading to false here since we didn't set it to true in pending
        state.error = action.error.message || "Failed to unblock user"
      })

      .addCase(updateBookmarksAsync.fulfilled, (state, action) => {
        state.users = state.users.map((user) =>
          user.username === action.payload.username ? action.payload : user
        )
      })
      .addCase(updateBookmarksAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to update bookmarks"
      })

      // Handle update profile cases
      .addCase(updateProfileAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.map((user) =>
          user.username === action.payload.username ? action.payload : user
        )
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to update profile"
      })

      // Handle update user score cases
      .addCase(updateUserScoreAsync.pending, (state) => {
        // Don't set global loading state to true for score updates
        // This prevents unnecessary UI refreshes
        state.error = null
      })
      .addCase(updateUserScoreAsync.fulfilled, (state, action) => {
        // Update only the specific user that changed
        state.users = state.users.map((user) =>
          user.username === action.payload.username ? action.payload : user
        )
      })
      .addCase(updateUserScoreAsync.rejected, (state, action) => {
        // Don't set loading to false here since we didn't set it to true in pending
        state.error = action.error.message || "Failed to update user score"
      })

      // Handle get user signals count cases
      .addCase(getUserSignalsCountAsync.pending, (state) => {
        state.signalsCountLoading = true
        state.error = null
      })
      .addCase(getUserSignalsCountAsync.fulfilled, (state, action) => {
        state.signalsCountLoading = false
        state.signalsCount = action.payload.count
      })
      .addCase(getUserSignalsCountAsync.rejected, (state, action) => {
        state.signalsCountLoading = false
        state.error = action.error.message || "Failed to fetch user signals count"
      })
  }
})

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default usersSlice.reducer
