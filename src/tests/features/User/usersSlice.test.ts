import usersReducer, {
  addUser,
  blockUser,
  bookmarkPost,
  bookmarkSignal,
  followUser,
  unBookmarkPost,
  unBookmarkSignal,
  unfollowUser,
  updateUserScore,
  useAppSelector
} from "@/features/User/usersSlice"
import { AccountModel, PostModel, SignalModel } from "@/shared/models"

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
    followings: [],
    followers: [],
    bookmarks: { signals: [], posts: [] },
    blockedAccounts: []
  }

  const initialState: AccountModel[] = [mockUser1]

  test("should handle initial state", () => {
    expect(usersReducer(undefined, { type: "unknown" })).toEqual(expect.any(Array))
  })

  test("should handle addUser", () => {
    const action = addUser(mockUser2)
    const state = usersReducer(initialState, action)

    expect(state.length).toBe(2)
    expect(state[1]).toEqual(mockUser2)
  })

  test("should handle followUser", () => {
    const action = followUser({
      followerUsername: "testuser",
      followingUsername: "anotheruser"
    })

    // Add both users to the state
    const stateWithBothUsers = [...initialState, mockUser2]
    const state = usersReducer(stateWithBothUsers, action)

    // Check if testuser is now following anotheruser
    const testUser = state.find((user) => user.username === "testuser")
    expect(testUser?.followings.length).toBe(1)
    expect(testUser?.followings[0].username).toBe("anotheruser")

    // Check if anotheruser now has testuser as a follower
    const anotherUser = state.find((user) => user.username === "anotheruser")
    expect(anotherUser?.followers.length).toBe(1)
    expect(anotherUser?.followers[0].username).toBe("testuser")
  })

  test("should handle unfollowUser", () => {
    // First make testuser follow anotheruser
    const stateWithBothUsers = [...initialState, mockUser2]
    let state = usersReducer(
      stateWithBothUsers,
      followUser({
        followerUsername: "testuser",
        followingUsername: "anotheruser"
      })
    )

    // Then unfollow
    const action = unfollowUser({
      followerUsername: "testuser",
      followingUsername: "anotheruser"
    })
    state = usersReducer(state, action)

    // Check if testuser is no longer following anotheruser
    const testUser = state.find((user) => user.username === "testuser")
    expect(testUser?.followings.length).toBe(0)

    // Check if anotheruser no longer has testuser as a follower
    const anotherUser = state.find((user) => user.username === "anotheruser")
    expect(anotherUser?.followers.length).toBe(0)
  })

  test("should handle updateUserScore", () => {
    // Create a mock signal with touched targets
    const mockSignal: SignalModel = {
      id: "1",
      market: {
        name: "BTC/USD",
        uuid: "bitcoin-uuid"
      },
      entry: 50000,
      stoploss: 48000,
      targets: [
        { id: "t1", value: 52000, touched: true },
        { id: "t2", value: 55000, touched: false }
      ],
      openTime: Date.now() - 7200000, // 2 hours ago
      closeTime: Date.now() - 3600000, // 1 hour ago (recently closed)
      status: "closed",
      date: Date.now() - 86400000, // 1 day ago
      likes: [],
      description: "Test signal",
      isPremium: false,
      publisher: {
        username: "testuser",
        name: "Test User",
        imageUrl: "test-image.jpg",
        score: 100
      }
    }

    // Mock the current time to be just after the signal closed
    const originalDate = Date.now
    Date.now = jest.fn().mockReturnValue(mockSignal.closeTime + 60000) // 1 minute after close

    const action = updateUserScore({ signal: mockSignal })
    const state = usersReducer(initialState, action)

    // Check if the user's score was increased
    const testUser = state.find((user) => user.username === "testuser")
    expect(testUser?.score).toBe(101) // Original 100 + 1 for the touched target

    // Restore the original Date.now
    Date.now = originalDate
  })

  test("should handle blockUser", () => {
    // Add both users to the state
    const stateWithBothUsers = [...initialState, mockUser2]

    const action = blockUser({
      blockerUsername: "testuser",
      blockedUsername: "anotheruser"
    })

    const state = usersReducer(stateWithBothUsers, action)

    // Check if anotheruser is in testuser's blockedAccounts
    const testUser = state.find((user) => user.username === "testuser")
    expect(testUser?.blockedAccounts.length).toBe(1)
    expect(testUser?.blockedAccounts[0].username).toBe("anotheruser")

    // If they were following each other, they should no longer be
    expect(testUser?.followings.length).toBe(0)
    expect(testUser?.followers.length).toBe(0)
  })

  test("should handle bookmarkPost", () => {
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

    const action = bookmarkPost({
      userUsername: "testuser",
      post: mockPost
    })

    const state = usersReducer(initialState, action)

    // Check if the post was added to the user's bookmarks
    const testUser = state.find((user) => user.username === "testuser")
    expect(testUser?.bookmarks.posts.length).toBe(1)
    expect(testUser?.bookmarks.posts[0].id).toBe("1")
    expect(testUser?.bookmarks.signals.length).toBe(0) // Signals should be unchanged
  })

  test("should handle unBookmarkPost", () => {
    // First bookmark a post
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

    let state = usersReducer(
      initialState,
      bookmarkPost({
        userUsername: "testuser",
        post: mockPost
      })
    )

    // Then unbookmark it
    const action = unBookmarkPost({
      userUsername: "testuser",
      postId: "1"
    })

    state = usersReducer(state, action)

    // Check if the post was removed from the user's bookmarks
    const testUser = state.find((user) => user.username === "testuser")
    expect(testUser?.bookmarks.posts.length).toBe(0)
  })

  test("should handle bookmarkSignal", () => {
    const mockSignal: SignalModel = {
      id: "1",
      market: {
        name: "BTC/USD",
        uuid: "bitcoin-uuid"
      },
      entry: 50000,
      stoploss: 48000,
      targets: [
        { id: "t1", value: 52000, touched: false },
        { id: "t2", value: 55000, touched: false }
      ],
      openTime: Date.now() + 3600000,
      closeTime: Date.now() + 86400000,
      status: "not_opened",
      date: Date.now(),
      likes: [],
      description: "Test signal",
      isPremium: false,
      publisher: {
        username: "anotheruser",
        name: "Another User",
        imageUrl: "another-image.jpg",
        score: 200
      }
    }

    const action = bookmarkSignal({
      userUsername: "testuser",
      signal: mockSignal
    })

    const state = usersReducer(initialState, action)

    // Check if the signal was added to the user's bookmarks
    const testUser = state.find((user) => user.username === "testuser")
    expect(testUser?.bookmarks.signals.length).toBe(1)
    expect(testUser?.bookmarks.signals[0].id).toBe("1")
    expect(testUser?.bookmarks.posts.length).toBe(0) // Posts should be unchanged
  })

  test("should handle unBookmarkSignal", () => {
    // First bookmark a signal
    const mockSignal: SignalModel = {
      id: "1",
      market: {
        name: "BTC/USD",
        uuid: "bitcoin-uuid"
      },
      entry: 50000,
      stoploss: 48000,
      targets: [
        { id: "t1", value: 52000, touched: false },
        { id: "t2", value: 55000, touched: false }
      ],
      openTime: Date.now() + 3600000,
      closeTime: Date.now() + 86400000,
      status: "not_opened",
      date: Date.now(),
      likes: [],
      description: "Test signal",
      isPremium: false,
      publisher: {
        username: "anotheruser",
        name: "Another User",
        imageUrl: "another-image.jpg",
        score: 200
      }
    }

    let state = usersReducer(
      initialState,
      bookmarkSignal({
        userUsername: "testuser",
        signal: mockSignal
      })
    )

    // Then unbookmark it
    const action = unBookmarkSignal({
      userUsername: "testuser",
      signalId: "1"
    })

    state = usersReducer(state, action)

    // Check if the signal was removed from the user's bookmarks
    const testUser = state.find((user) => user.username === "testuser")
    expect(testUser?.bookmarks.signals.length).toBe(0)
  })

  test("should not modify state when following a non-existent user", () => {
    const action = followUser({
      followerUsername: "testuser",
      followingUsername: "nonexistent"
    })

    const state = usersReducer(initialState, action)

    // State should remain unchanged
    expect(state).toEqual(initialState)
  })

  test("should not modify state when unfollowing a non-existent user", () => {
    const action = unfollowUser({
      followerUsername: "testuser",
      followingUsername: "nonexistent"
    })

    const state = usersReducer(initialState, action)

    // State should remain unchanged
    expect(state).toEqual(initialState)
  })

  test("should not modify state when blocking a non-existent user", () => {
    const action = blockUser({
      blockerUsername: "testuser",
      blockedUsername: "nonexistent"
    })

    const state = usersReducer(initialState, action)

    // State should remain unchanged
    expect(state).toEqual(initialState)
  })

  test("should not add duplicate blocked accounts", () => {
    // First block a user
    const stateWithBothUsers = [...initialState, mockUser2]
    let state = usersReducer(
      stateWithBothUsers,
      blockUser({
        blockerUsername: "testuser",
        blockedUsername: "anotheruser"
      })
    )

    // Try to block the same user again
    state = usersReducer(
      state,
      blockUser({
        blockerUsername: "testuser",
        blockedUsername: "anotheruser"
      })
    )

    // Should still only have one blocked account
    const testUser = state.find((user) => user.username === "testuser")
    expect(testUser?.blockedAccounts.length).toBe(1)
  })

  test("should handle updateUserScore with multiple touched targets", () => {
    // Create a mock signal with multiple touched targets
    const mockSignal: SignalModel = {
      id: "1",
      market: {
        name: "BTC/USD",
        uuid: "bitcoin-uuid"
      },
      entry: 50000,
      stoploss: 48000,
      targets: [
        { id: "t1", value: 52000, touched: true },
        { id: "t2", value: 55000, touched: true },
        { id: "t3", value: 58000, touched: true }
      ],
      openTime: Date.now() - 7200000, // 2 hours ago
      closeTime: Date.now() - 3600000, // 1 hour ago (recently closed)
      status: "closed",
      date: Date.now() - 86400000, // 1 day ago
      likes: [],
      description: "Test signal",
      isPremium: false,
      publisher: {
        username: "testuser",
        name: "Test User",
        imageUrl: "test-image.jpg",
        score: 100
      }
    }

    // Mock the current time to be just after the signal closed
    const originalDate = Date.now
    Date.now = jest.fn().mockReturnValue(mockSignal.closeTime + 60000) // 1 minute after close

    const action = updateUserScore({ signal: mockSignal })
    const state = usersReducer(initialState, action)

    // Check if the user's score was increased by 3 (for 3 touched targets)
    const testUser = state.find((user) => user.username === "testuser")
    expect(testUser?.score).toBe(103) // Original 100 + 3 for the touched targets

    // Restore the original Date.now
    Date.now = originalDate
  })

  test("should not update score for signals that closed too long ago", () => {
    // Create a mock signal that closed a long time ago
    const mockSignal: SignalModel = {
      id: "1",
      market: {
        name: "BTC/USD",
        uuid: "bitcoin-uuid"
      },
      entry: 50000,
      stoploss: 48000,
      targets: [
        { id: "t1", value: 52000, touched: true },
        { id: "t2", value: 55000, touched: true }
      ],
      openTime: Date.now() - 86400000, // 1 day ago
      closeTime: Date.now() - 3600000, // 1 hour ago
      status: "closed",
      date: Date.now() - 172800000, // 2 days ago
      likes: [],
      description: "Test signal",
      isPremium: false,
      publisher: {
        username: "testuser",
        name: "Test User",
        imageUrl: "test-image.jpg",
        score: 100
      }
    }

    // Mock the current time to be long after the signal closed
    const originalDate = Date.now
    Date.now = jest.fn().mockReturnValue(mockSignal.closeTime + 3600000) // 1 hour after close

    const action = updateUserScore({ signal: mockSignal })
    const state = usersReducer(initialState, action)

    // Check if the user's score remains unchanged
    const testUser = state.find((user) => user.username === "testuser")
    expect(testUser?.score).toBe(100) // Score should remain unchanged

    // Restore the original Date.now
    Date.now = originalDate
  })

  // Test for useAppSelector
  test("useAppSelector should be properly exported", () => {
    expect(useAppSelector).toBeDefined()
  })
})
