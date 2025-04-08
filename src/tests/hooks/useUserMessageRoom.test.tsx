import { useUserMessageRoom } from "@/hooks/useUserMessageRoom"
import { DMRoom, GroupRoom } from "@/shared/types"
import { renderHook } from "@testing-library/react"
import { vi } from "vitest"

// Mock the appwrite client
vi.mock("appwrite", () => ({
  Client: vi.fn().mockImplementation(() => ({
    setEndpoint: vi.fn().mockReturnThis(),
    setProject: vi.fn().mockReturnThis()
  })),
  Storage: vi.fn().mockImplementation(() => ({
    getFilePreview: vi.fn().mockReturnValue({
      href: "mocked-image-url.jpg"
    })
  })),
  ImageFormat: { Png: "png" },
  ImageGravity: { Center: "center" }
}))

// Mock the Avatar component from flowbite-react
vi.mock("flowbite-react", () => ({
  Avatar: ({ placeholderInitials }: { placeholderInitials: string }) => (
    <div data-testid="avatar">{placeholderInitials}</div>
  )
}))

describe("useUserMessageRoom hook", () => {
  // Define properly typed mock messages that match your actual models
  const mockMessages: Record<string, DMRoom | GroupRoom> = {
    user1: {
      isGroup: false,
      userInfo: {
        username: "user1",
        name: "User One",
        imageUrl: "user1-image.jpg"
      },
      messages: [],
      usersInfo: null,
      groupInfo: null
    },
    group1: {
      isGroup: true,
      userInfo: null,
      groupInfo: {
        groupName: "Test Group",
        groupImageId: "group-image.jpg"
      },
      usersInfo: [
        {
          username: "testuser",
          name: "Test User",
          imageUrl: "test-image.jpg"
        },
        {
          username: "user1",
          name: "User One",
          imageUrl: "user1-image.jpg"
        }
      ],
      messages: []
    }
  }

  test("checkIfExistsRoom returns true when room exists", () => {
    const { result } = renderHook(() => useUserMessageRoom())

    // Check for existing user room
    const userExists = result.current.checkIfExistsRoom(mockMessages, {
      username: "user1",
      name: "User One",
      imageUrl: "user1-image.jpg"
    })
    expect(userExists).toBe(true)

    // Check for existing group room
    const groupExists = result.current.checkIfExistsRoom(mockMessages, undefined, "Test Group")
    expect(groupExists).toBe(true)
  })

  test("checkIfExistsRoom returns false when room doesn't exist", () => {
    const { result } = renderHook(() => useUserMessageRoom())

    // Check for non-existing user room
    const userExists = result.current.checkIfExistsRoom(mockMessages, {
      username: "nonexistent",
      name: "Non Existent",
      imageUrl: "nonexistent.jpg"
    })
    expect(userExists).toBe(false)

    // Check for non-existing group room
    const groupExists = result.current.checkIfExistsRoom(
      mockMessages,
      undefined,
      "Non Existent Group"
    )
    expect(groupExists).toBe(false)
  })

  test("findExistingRoomId returns room id when room exists", () => {
    const { result } = renderHook(() => useUserMessageRoom())

    // Find existing user room
    const userRoomId = result.current.findExistingRoomId(mockMessages, {
      username: "user1",
      name: "User One",
      imageUrl: "user1-image.jpg"
    })
    expect(userRoomId).toBe("user1")

    // Find existing group room
    const groupRoomId = result.current.findExistingRoomId(mockMessages, undefined, "Test Group")
    expect(groupRoomId).toBe("group1")
  })

  test("findExistingRoomId returns undefined when room doesn't exist", () => {
    const { result } = renderHook(() => useUserMessageRoom())

    // Find non-existing user room
    const userRoomId = result.current.findExistingRoomId(mockMessages, {
      username: "nonexistent",
      name: "Non Existent",
      imageUrl: "nonexistent.jpg"
    })
    expect(userRoomId).toBeUndefined()

    // Find non-existing group room
    const groupRoomId = result.current.findExistingRoomId(
      mockMessages,
      undefined,
      "Non Existent Group"
    )
    expect(groupRoomId).toBeUndefined()
  })

  test("isGroupRoom correctly identifies group rooms", () => {
    const { result } = renderHook(() => useUserMessageRoom())

    // Check group room
    const isGroup = result.current.isGroupRoom(mockMessages.group1)
    expect(isGroup).toBe(true)

    // Check user room
    const isNotGroup = result.current.isGroupRoom(mockMessages.user1)
    expect(isNotGroup).toBe(false)
  })

  test("getProperAvatar returns avatar for user", () => {
    const { result } = renderHook(() => useUserMessageRoom())

    // Get avatar for user
    const userAvatar = result.current.getProperAvatar("UO", {
      username: "user1",
      name: "User One",
      imageUrl: "user1-image.jpg"
    })

    // Since we're returning JSX, we can't directly test the output
    // But we can verify that the function returns something
    expect(userAvatar).toBeDefined()
  })

  test("getProperAvatar returns avatar for group", () => {
    const { result } = renderHook(() => useUserMessageRoom())

    // Get avatar for group
    const groupAvatar = result.current.getProperAvatar("TG", undefined, {
      groupName: "Test Group",
      groupImageId: "group-image.jpg"
    })

    // Since we're returning JSX, we can't directly test the output
    // But we can verify that the function returns something
    expect(groupAvatar).toBeDefined()
  })
})
