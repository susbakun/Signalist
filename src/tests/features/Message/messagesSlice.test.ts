import messagesReducer, {
  createDMConversationAsync,
  createGroupConversationAsync,
  createGroup,
  createRoom,
  fetchUserConversations,
  sendMessage,
  sendMessageAsync
} from "@/features/Message/messagesSlice"
import * as messagesApi from "@/services/messagesApi"
import { vi } from "vitest"

// Mock the messagesApi module
vi.mock("@/services/messagesApi", () => ({
  getUserConversations: vi.fn(),
  getConversationMessages: vi.fn(),
  sendMessage: vi.fn(),
  createDMConversation: vi.fn(),
  createGroupConversation: vi.fn(),
  uploadMessageImage: vi.fn()
}))

describe("messagesSlice", () => {
  // Mock the initial state with the new structure
  const initialState = {
    conversations: {
      testuser: {}
    },
    loading: false,
    error: null
  }

  // Mock user data
  const mockUser = {
    username: "testuser",
    name: "Test User",
    imageUrl: "test-image.jpg"
  }

  const mockRecipient = {
    username: "recipient",
    name: "Recipient User",
    imageUrl: "recipient-image.jpg"
  }

  test("should handle initial state", () => {
    expect(messagesReducer(undefined, { type: "unknown" })).toEqual({
      conversations: {},
      loading: false,
      error: null
    })
  })

  test("should handle createRoom", () => {
    const action = createRoom({
      myUsername: "testuser",
      roomId: "room1",
      userInfo: mockRecipient
    })

    const state = messagesReducer(initialState, action)

    expect(state.conversations.testuser.room1).toBeDefined()
    expect(state.conversations.testuser.room1.isGroup).toBe(false)
    expect(state.conversations.testuser.room1.userInfo).toEqual(mockRecipient)
    expect(state.conversations.testuser.room1.messages).toEqual([])
    expect(state.conversations.testuser.room1.groupInfo).toBeNull()
    expect(state.conversations.testuser.room1.usersInfo).toBeNull()
  })

  test("should handle createGroup", () => {
    const mockGroupInfo = {
      groupName: "Test Group",
      groupImageHref: "group-image-url"
    }

    const mockUserInfos = [mockUser, mockRecipient]

    const action = createGroup({
      myUsername: "testuser",
      roomId: "group1",
      userInfos: mockUserInfos,
      groupInfo: mockGroupInfo
    })

    const state = messagesReducer(initialState, action)

    expect(state.conversations.testuser.group1).toBeDefined()
    expect(state.conversations.testuser.group1.isGroup).toBe(true)
    expect(state.conversations.testuser.group1.groupInfo).toEqual(mockGroupInfo)
    expect(state.conversations.testuser.group1.usersInfo).toEqual(mockUserInfos)
    expect(state.conversations.testuser.group1.messages).toEqual([])
    expect(state.conversations.testuser.group1.userInfo).toBeNull()
  })

  test("should handle sendMessage in a direct message room", () => {
    // First create a room
    let state = messagesReducer(
      initialState,
      createRoom({
        myUsername: "testuser",
        roomId: "room1",
        userInfo: mockRecipient
      })
    )

    // Add recipient to the state
    state = {
      ...state,
      conversations: {
        ...state.conversations,
        recipient: {}
      }
    }

    // Then send a message
    const action = sendMessage({
      sender: mockUser,
      roomId: "room1",
      text: "Hello, recipient!"
    })

    state = messagesReducer(state, action)

    // Check if message was added to sender's room
    expect(state.conversations.testuser.room1.messages.length).toBe(1)
    expect(state.conversations.testuser.room1.messages[0].text).toBe("Hello, recipient!")
    expect(state.conversations.testuser.room1.messages[0].sender).toEqual(mockUser)
    expect(state.conversations.testuser.room1.messages[0].date).toEqual(expect.any(Number))

    // Check if message was added to recipient's room
    expect(state.conversations.recipient.room1).toBeDefined()
    expect(state.conversations.recipient.room1.messages.length).toBe(1)
    expect(state.conversations.recipient.room1.messages[0].text).toBe("Hello, recipient!")
  })

  test("should handle sendMessage with an image", () => {
    // First create a room
    let state = messagesReducer(
      initialState,
      createRoom({
        myUsername: "testuser",
        roomId: "room1",
        userInfo: mockRecipient
      })
    )

    // Add recipient to the state
    state = {
      ...state,
      conversations: {
        ...state.conversations,
        recipient: {}
      }
    }

    // Then send a message with an image
    const action = sendMessage({
      sender: mockUser,
      roomId: "room1",
      text: "Check out this image!",
      messageImageHref: "image-url-123"
    })

    state = messagesReducer(state, action)

    // Check if message was added with image
    expect(state.conversations.testuser.room1.messages[0].messageImageHref).toBe("image-url-123")
    expect(state.conversations.recipient.room1.messages[0].messageImageHref).toBe("image-url-123")
  })

  test("should handle sendMessage in a group", () => {
    const mockGroupInfo = {
      groupName: "Test Group",
      groupImageHref: "group-image-url"
    }

    const mockMember = {
      username: "member",
      name: "Group Member",
      imageUrl: "member-image.jpg"
    }

    const mockUserInfos = [mockUser, mockRecipient, mockMember]

    // First create a group
    let state = messagesReducer(
      initialState,
      createGroup({
        myUsername: "testuser",
        roomId: "group1",
        userInfos: mockUserInfos,
        groupInfo: mockGroupInfo
      })
    )

    // Add other members to the state
    state = {
      ...state,
      conversations: {
        ...state.conversations,
        recipient: {},
        member: {}
      }
    }

    // Then send a message to the group
    const action = sendMessage({
      sender: mockUser,
      roomId: "group1",
      text: "Hello, group!"
    })

    state = messagesReducer(state, action)

    // Check if message was added to sender's room
    expect(state.conversations.testuser.group1.messages.length).toBe(1)
    expect(state.conversations.testuser.group1.messages[0].text).toBe("Hello, group!")

    // Check if message was added to all group members' rooms
    expect(state.conversations.recipient.group1).toBeDefined()
    expect(state.conversations.recipient.group1.messages.length).toBe(1)
    expect(state.conversations.recipient.group1.messages[0].text).toBe("Hello, group!")

    expect(state.conversations.member.group1).toBeDefined()
    expect(state.conversations.member.group1.messages.length).toBe(1)
    expect(state.conversations.member.group1.messages[0].text).toBe("Hello, group!")
  })

  test("should create a new room for recipient if it doesn't exist", () => {
    // Start with a state that doesn't have the recipient
    const state = {
      conversations: {
        testuser: {},
        recipient: {}
      },
      loading: false,
      error: null
    }

    // First create a room for the sender
    let newState = messagesReducer(
      state,
      createRoom({
        myUsername: "testuser",
        roomId: "room1",
        userInfo: mockRecipient
      })
    )

    // Then send a message
    const action = sendMessage({
      sender: mockUser,
      roomId: "room1",
      text: "Hello, new recipient!"
    })

    newState = messagesReducer(newState, action)

    // Check if a new room was created for the recipient
    expect(newState.conversations.recipient).toBeDefined()
    expect(newState.conversations.recipient.room1).toBeDefined()
    expect(newState.conversations.recipient.room1.userInfo?.username).toBe("testuser")
    expect(newState.conversations.recipient.room1.messages.length).toBe(1)
    expect(newState.conversations.recipient.room1.messages[0].text).toBe("Hello, new recipient!")
  })

  test("should create a new room for group member if it doesn't exist", () => {
    const mockGroupInfo = {
      groupName: "Test Group",
      groupImageHref: "group-image-url"
    }

    const mockUserInfos = [mockUser, mockRecipient]

    // First create a group for the sender
    let state = messagesReducer(
      initialState,
      createGroup({
        myUsername: "testuser",
        roomId: "group1",
        userInfos: mockUserInfos,
        groupInfo: mockGroupInfo
      })
    )

    // Then send a message to the group
    const action = sendMessage({
      sender: mockUser,
      roomId: "group1",
      text: "Hello, new group member!"
    })

    state = messagesReducer(state, action)

    // Check if a new room was created for the other group member
    expect(state.conversations.recipient).toBeDefined()
    expect(state.conversations.recipient.group1).toBeDefined()
    expect(state.conversations.recipient.group1.isGroup).toBe(true)
    expect(state.conversations.recipient.group1.groupInfo).toEqual(mockGroupInfo)
    expect(state.conversations.recipient.group1.messages.length).toBe(1)
    expect(state.conversations.recipient.group1.messages[0].text).toBe("Hello, new group member!")
  })

  // Async thunk tests
  test("fetchUserConversations.fulfilled should update user conversations", async () => {
    const mockConversations = {
      room1: {
        userInfo: mockRecipient,
        messages: [],
        isGroup: false,
        groupInfo: null,
        usersInfo: null
      }
    }

    // Mock the API call
    vi.mocked(messagesApi.getUserConversations).mockResolvedValueOnce(mockConversations)

    // Create the action
    const action = {
      type: fetchUserConversations.fulfilled.type,
      payload: mockConversations,
      meta: { arg: "testuser" }
    }

    const state = messagesReducer(initialState, action)

    expect(state.loading).toBe(false)
    expect(state.conversations.testuser).toEqual(mockConversations)
  })

  test("createDMConversationAsync.fulfilled should create a new DM room", async () => {
    const mockResponse = {
      roomId: "new-room",
      userInfo: mockRecipient,
      messages: [],
      isGroup: false,
      groupInfo: null,
      usersInfo: null
    }

    // Mock the API call
    vi.mocked(messagesApi.createDMConversation).mockResolvedValueOnce(mockResponse)

    // Create the action
    const action = {
      type: createDMConversationAsync.fulfilled.type,
      payload: mockResponse,
      meta: { arg: { user1: mockUser, user2: mockRecipient } }
    }

    const state = messagesReducer(initialState, action)

    expect(state.loading).toBe(false)
    expect(state.conversations.testuser["new-room"]).toEqual(mockResponse)
  })

  test("createGroupConversationAsync.fulfilled should create a new group", async () => {
    const mockGroupInfo = {
      groupName: "New Test Group",
      groupImageHref: "new-group-image-url"
    }

    const mockUserInfos = [mockUser, mockRecipient]

    const mockResponse = {
      roomId: "new-group",
      userInfo: null,
      messages: [],
      isGroup: true,
      groupInfo: mockGroupInfo,
      usersInfo: mockUserInfos
    }

    // Mock the API call
    vi.mocked(messagesApi.createGroupConversation).mockResolvedValueOnce(mockResponse)

    // Create the action
    const action = {
      type: createGroupConversationAsync.fulfilled.type,
      payload: mockResponse,
      meta: {
        arg: {
          groupName: mockGroupInfo.groupName,
          members: mockUserInfos,
          createdBy: mockUser
        }
      }
    }

    const state = messagesReducer(initialState, action)

    expect(state.loading).toBe(false)
    expect(state.conversations.testuser["new-group"]).toEqual(mockResponse)
  })

  test("sendMessageAsync should set loading to true when pending", () => {
    const action = { type: sendMessageAsync.pending.type }
    const state = messagesReducer(initialState, action)
    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  test("sendMessageAsync should set error when rejected", () => {
    const action = {
      type: sendMessageAsync.rejected.type,
      error: { message: "Test error" }
    }
    const state = messagesReducer(initialState, action)
    expect(state.loading).toBe(false)
    expect(state.error).toBe("Test error")
  })
})
