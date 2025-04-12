import { AccountModel, SignalModel } from "@/shared/models"
import { RootState } from "@/shared/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import * as usersApi from "@/services/usersApi"

// Define the state type with loading and error states
interface UsersState {
  users: AccountModel[]
  loading: boolean
  error: string | null
}

// Set up initial state with loading and error fields
const initialState: UsersState = {
  users: [],
  loading: false,
  error: null
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
    // Define the response type that may include token
    interface RegisterResponse {
      user?: AccountModel
      token?: string
    }

    const response = await usersApi.createUser(user)

    // Check if response has user and token properties
    const fullResponse = response as AccountModel | RegisterResponse

    if (
      "token" in fullResponse &&
      "user" in fullResponse &&
      fullResponse.token &&
      fullResponse.user
    ) {
      // It's a response with both token and user
      localStorage.setItem("token", fullResponse.token)
      return fullResponse.user
    }

    // It's just the user
    return response as AccountModel
  }
)

export const loginUserAsync = createAsyncThunk(
  "users/loginUser",
  async (credentials: { email: string; password: string }) => {
    const response = await usersApi.loginUser(credentials)
    // Store token in localStorage
    localStorage.setItem("token", response.token)
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

export const updateBookmarksAsync = createAsyncThunk(
  "users/updateBookmarks",
  async (data: { username: string; bookmarks: AccountModel["bookmarks"] }) => {
    return await usersApi.updateBookmarks(data.username, data.bookmarks)
  }
)

export const updateProfileAsync = createAsyncThunk(
  "users/updateProfile",
  async (data: {
    username: string
    updates: Partial<Pick<AccountModel, "name" | "bio" | "imageUrl" | "username" | "email">>
  }) => {
    return await usersApi.updateProfile(data.username, data.updates)
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
            action.payload.blockedAccounts[action.payload.blockedAccounts.length - 1].username
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

      // Handle update bookmarks cases
      .addCase(updateBookmarksAsync.pending, (state) => {
        // Don't set global loading state to true for bookmark actions
        // This prevents unnecessary UI refreshes
        state.error = null
      })
      .addCase(updateBookmarksAsync.fulfilled, (state, action) => {
        // Update only the specific user that changed
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
  }
})

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default usersSlice.reducer
