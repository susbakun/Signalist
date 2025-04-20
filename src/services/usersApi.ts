import { backendUrl } from "@/shared/constants"
import { AccountModel, SignalModel } from "@/shared/models"
import { BookmarkType } from "@/shared/types"

const API_URL = `${backendUrl}/users`

export const getUsers = async (): Promise<AccountModel[]> => {
  try {
    const response = await fetch(`${API_URL}`)
    if (!response.ok) {
      throw new Error("Failed to fetch users")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

export const getUserByUsername = async (username: string): Promise<AccountModel> => {
  try {
    const response = await fetch(`${API_URL}/${username}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch user with username: ${username}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching user ${username}:`, error)
    throw error
  }
}

export const createUser = async (
  user: Omit<AccountModel, "followers" | "followings" | "bookmarks" | "blockedAccounts" | "score">
): Promise<AccountModel> => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })

    // Handle non-ok responses with more specific error details
    if (!response.ok) {
      const errorData = await response.json()

      // Extract specific error message and field if available
      const errorMessage = errorData.message || "Failed to create user"
      const errorField = errorData.field

      // Create an error with field info for better error handling in UI
      if (errorField) {
        // Create a custom error to track the specific field
        const fieldError = new Error(errorMessage)
        // @ts-expect-error - Add custom field property to Error object
        fieldError.field = errorField
        throw fieldError
      } else {
        throw new Error(errorMessage)
      }
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export const loginUser = async (credentials: {
  email: string
  password: string
}): Promise<{ user: AccountModel; token: string }> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    })
    if (!response.ok) {
      throw new Error("Failed to login")
    }
    return await response.json()
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}

export const followUser = async (
  followerUsername: string,
  followingUsername: string
): Promise<AccountModel> => {
  try {
    const response = await fetch(`${API_URL}/${followerUsername}/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ followingUsername })
    })
    if (!response.ok) {
      console.error(
        `Failed to follow user. Status: ${response.status}, Follower: ${followerUsername}, Following: ${followingUsername}`
      )
      throw new Error("Failed to follow user")
    }
    return await response.json()
  } catch (error) {
    console.error("Error following user:", error)
    throw error
  }
}

export const unfollowUser = async (
  followerUsername: string,
  followingUsername: string
): Promise<AccountModel> => {
  try {
    const response = await fetch(`${API_URL}/${followerUsername}/unfollow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ followingUsername })
    })
    if (!response.ok) {
      throw new Error("Failed to unfollow user")
    }
    return await response.json()
  } catch (error) {
    console.error("Error unfollowing user:", error)
    throw error
  }
}

export const blockUser = async (
  blockerUsername: string,
  blockedUsername: string
): Promise<AccountModel> => {
  try {
    const response = await fetch(`${API_URL}/${blockerUsername}/block`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ blockedUsername })
    })
    if (!response.ok) {
      throw new Error("Failed to block user")
    }
    return await response.json()
  } catch (error) {
    console.error("Error blocking user:", error)
    throw error
  }
}

export const unblockUser = async (
  blockerUsername: string,
  blockedUsername: string
): Promise<AccountModel> => {
  try {
    const response = await fetch(`${API_URL}/${blockerUsername}/unblock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ blockedUsername })
    })
    if (!response.ok) {
      throw new Error("Failed to unblock user")
    }
    return await response.json()
  } catch (error) {
    console.error("Error unblocking user:", error)
    throw error
  }
}

export const updateBookmarks = async (
  username: string,
  bookmarks: BookmarkType
): Promise<AccountModel> => {
  try {
    const response = await fetch(`${API_URL}/${username}/bookmarks`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ bookmarks })
    })
    if (!response.ok) {
      throw new Error("Failed to update bookmarks")
    }
    return await response.json()
  } catch (error) {
    console.error("Error updating bookmarks:", error)
    throw error
  }
}

export const updateProfile = async (
  username: string,
  updates: Partial<Pick<AccountModel, "name" | "bio" | "imageUrl" | "username" | "email">>
): Promise<AccountModel> => {
  try {
    const response = await fetch(`${API_URL}/${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updates)
    })
    if (!response.ok) {
      throw new Error("Failed to update profile")
    }
    return await response.json()
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}

export const updateUserScore = async (signal: SignalModel): Promise<AccountModel> => {
  try {
    // Using the publisher's username from the signal
    const username = signal.publisher.username

    const response = await fetch(`${API_URL}/${username}/score`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ signal })
    })

    if (!response.ok) {
      throw new Error("Failed to update user score")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating user score:", error)
    throw error
  }
}
