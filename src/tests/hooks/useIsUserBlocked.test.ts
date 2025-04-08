import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"
import { AccountModel } from "@/shared/models"
import { describe, expect, it } from "vitest"

describe("useIsUserBlocked hook", () => {
  it("should return false when user is not blocked", () => {
    const mockAccount: AccountModel = {
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: "password",
      score: 100,
      hasPremium: false,
      followings: [],
      followers: [],
      bookmarks: { signals: [], posts: [] },
      blockedAccounts: [{ username: "blockeduser", name: "Blocked User", imageUrl: "blocked.jpg" }]
    }

    const { isUserBlocked } = useIsUserBlocked(mockAccount)
    const result = isUserBlocked("notblockeduser")
    expect(result).toBe(false)
  })

  it("should return true when user is blocked", () => {
    const mockAccount: AccountModel = {
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: "password",
      score: 100,
      hasPremium: false,
      followings: [],
      followers: [],
      bookmarks: { signals: [], posts: [] },
      blockedAccounts: [{ username: "blockeduser", name: "Blocked User", imageUrl: "blocked.jpg" }]
    }

    const { isUserBlocked } = useIsUserBlocked(mockAccount)
    const result = isUserBlocked("blockeduser")
    expect(result).toBe(true)
  })

  it("should handle undefined account", () => {
    const { isUserBlocked } = useIsUserBlocked(undefined)
    const result = isUserBlocked("anyuser")
    expect(result).toBe(undefined)
  })
})
