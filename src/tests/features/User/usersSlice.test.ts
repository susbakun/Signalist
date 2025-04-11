import usersReducer, {
  fetchUsersAsync,
  followUserAsync,
  unfollowUserAsync,
  blockUserAsync,
  updateBookmarksAsync,
  updateUserScoreAsync,
  useAppSelector
} from "@/features/User/usersSlice"
import { AccountModel, PostModel } from "@/shared/models"

describe("usersSlice", () => {
  // Mock user data
  const mockUser1: AccountModel = {
    name: "Test User",
    username: "testuser",
    email: "test@example.com",
    password: "password",
    imageUrl: "test-image.jpg",
    score: 100,
    hasPremium: false,
    subscriptionPlan: [],
    followings: [],
    followers: [],
    bookmarks: { signals: [], posts: [] },
    blockedAccounts: []
  }

  const mockUser2: AccountModel = {
    name: "Another User",
    username: "anotheruser",
    email: "another@example.com",
    password: "password",
    imageUrl: "another-image.jpg",
    score: 200,
    hasPremium: true,
    subscriptionPlan: [{ duration: "30 days", price: 9.99 }],
    followings: [],
    followers: [],
    bookmarks: { signals: [], posts: [] },
    blockedAccounts: []
  }

  const initialState = {
    users: [mockUser1],
    loading: false,
    error: null
  }

  test("should handle initial state", () => {
    expect(usersReducer(undefined, { type: "unknown" })).toEqual({
      users: [],
      loading: false,
      error: null
    })
  })

  test("should handle fetchUsersAsync.fulfilled", () => {
    const action = {
      type: fetchUsersAsync.fulfilled.type,
      payload: [mockUser1, mockUser2]
    }
    const state = usersReducer(initialState, action)
    expect(state.users.length).toBe(2)
    expect(state.users[1]).toEqual(mockUser2)
  })

  test("should handle followUserAsync.fulfilled", () => {
    const updatedUser1 = {
      ...mockUser1,
      followings: [{ username: "anotheruser", name: "Another User", imageUrl: "another-image.jpg" }]
    }

    const action = {
      type: followUserAsync.fulfilled.type,
      payload: updatedUser1
    }
    const state = usersReducer(initialState, action)

    expect(state.users[0].followings.length).toBe(1)
    expect(state.users[0].followings[0].username).toBe("anotheruser")
  })

  test("should handle unfollowUserAsync.fulfilled", () => {
    const updatedUser1 = {
      ...mockUser1,
      followings: []
    }

    const action = {
      type: unfollowUserAsync.fulfilled.type,
      payload: updatedUser1
    }
    const state = usersReducer(initialState, action)

    expect(state.users[0].followings.length).toBe(0)
  })

  test("should handle updateUserScoreAsync.fulfilled", () => {
    const updatedUser1 = {
      ...mockUser1,
      score: 101
    }

    const action = {
      type: updateUserScoreAsync.fulfilled.type,
      payload: updatedUser1
    }
    const state = usersReducer(initialState, action)

    expect(state.users[0].score).toBe(101)
  })

  test("should handle blockUserAsync.fulfilled", () => {
    const updatedUser1 = {
      ...mockUser1,
      blockedAccounts: [
        { username: "anotheruser", name: "Another User", imageUrl: "another-image.jpg" }
      ]
    }

    const action = {
      type: blockUserAsync.fulfilled.type,
      payload: updatedUser1
    }
    const state = usersReducer(initialState, action)

    expect(state.users[0].blockedAccounts.length).toBe(1)
    expect(state.users[0].blockedAccounts[0].username).toBe("anotheruser")
  })

  test("should handle updateBookmarksAsync.fulfilled", () => {
    const mockPost: PostModel = {
      id: "1",
      content: "Test post content",
      date: Date.now(),
      likes: [],
      comments: [],
      isPremium: false,
      publisher: {
        username: "anotheruser",
        name: "Another User",
        imageUrl: "another-image.jpg"
      }
    }

    const updatedUser1 = {
      ...mockUser1,
      bookmarks: {
        signals: [],
        posts: [mockPost]
      }
    }

    const action = {
      type: updateBookmarksAsync.fulfilled.type,
      payload: updatedUser1
    }
    const state = usersReducer(initialState, action)

    expect(state.users[0].bookmarks.posts.length).toBe(1)
    expect(state.users[0].bookmarks.posts[0].id).toBe("1")
  })

  test("should handle loading states", () => {
    const loadingAction = {
      type: fetchUsersAsync.pending.type
    }
    const loadingState = usersReducer(initialState, loadingAction)
    expect(loadingState.loading).toBe(true)

    const errorAction = {
      type: fetchUsersAsync.rejected.type,
      error: { message: "Failed to fetch users" }
    }
    const errorState = usersReducer(loadingState, errorAction)
    expect(errorState.loading).toBe(false)
    expect(errorState.error).toBe("Failed to fetch users")
  })

  // Test for useAppSelector
  test("useAppSelector should be properly exported", () => {
    expect(useAppSelector).toBeDefined()
  })
})
