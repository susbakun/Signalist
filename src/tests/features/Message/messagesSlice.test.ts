import messagesReducer, {
  createDMConversationAsync,
  createGroupConversationAsync,
  fetchUserConversations,
  sendMessageAsync,
  getNewMessage
} from "@/features/Message/messagesSlice"
import { DMRoom, GroupRoom } from "@/shared/types"

describe("messagesSlice", () => {
  // Mock the initial state with the new structure
  const initialState = {
    conversations: {},
    loading: false,
    error: null,
    socket: null
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
      error: null,
      socket: null
    })
  })

  test("should handle getNewMessage action", () => {
    // First set up a conversation
    const mockDMRoom: DMRoom = {
      isGroup: false as const,
      userInfo: mockRecipient,
      messages: [],
      groupInfo: null,
      usersInfo: null
    }

    const stateWithConversation = {
      conversations: {
        testuser: {
          room1: mockDMRoom
        }
      },
      loading: false,
      error: null,
      socket: null
    }

    const action = getNewMessage({
      currentUser: mockUser,
      messageRoomId: "room1",
      text: "Hello, recipient!",
      sender: mockUser
    })

    const state = messagesReducer(stateWithConversation, action)

    expect(state.conversations.testuser.room1.messages.length).toBe(1)
    expect(state.conversations.testuser.room1.messages[0].text).toBe("Hello, recipient!")
    expect(state.conversations.testuser.room1.messages[0].sender).toEqual(mockUser)
    expect(state.conversations.testuser.room1.messages[0].date).toEqual(expect.any(Number))
    expect(state.conversations.testuser.room1.messages[0].id).toEqual(expect.any(String))
  })

  test("should handle getNewMessage with different sender", () => {
    // First set up a conversation
    const mockDMRoom: DMRoom = {
      isGroup: false as const,
      userInfo: mockRecipient,
      messages: [],
      groupInfo: null,
      usersInfo: null
    }

    const stateWithConversation = {
      conversations: {
        testuser: {
          room1: mockDMRoom
        }
      },
      loading: false,
      error: null,
      socket: null
    }

    const action = getNewMessage({
      currentUser: mockUser,
      messageRoomId: "room1",
      text: "Hello from recipient!",
      sender: mockRecipient
    })

    const state = messagesReducer(stateWithConversation, action)

    expect(state.conversations.testuser.room1.messages.length).toBe(1)
    expect(state.conversations.testuser.room1.messages[0].text).toBe("Hello from recipient!")
    expect(state.conversations.testuser.room1.messages[0].sender).toEqual(mockRecipient)
  })

  // Async thunk tests
  test("fetchUserConversations.pending should set loading to true", () => {
    const action = { type: fetchUserConversations.pending.type }
    const state = messagesReducer(initialState, action)
    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  test("fetchUserConversations.fulfilled should update user conversations", () => {
    const mockDMRoom: DMRoom = {
      userInfo: mockRecipient,
      messages: [],
      isGroup: false as const,
      groupInfo: null,
      usersInfo: null
    }

    const mockConversations = {
      room1: mockDMRoom
    }

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

  test("fetchUserConversations.rejected should set error", () => {
    const action = {
      type: fetchUserConversations.rejected.type,
      error: { message: "Failed to fetch conversations" }
    }
    const state = messagesReducer(initialState, action)
    expect(state.loading).toBe(false)
    expect(state.error).toBe("Failed to fetch conversations")
  })

  test("createDMConversationAsync.pending should set loading to true", () => {
    const action = { type: createDMConversationAsync.pending.type }
    const state = messagesReducer(initialState, action)
    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  test("createDMConversationAsync.fulfilled should create a new DM room", () => {
    const mockResponse: DMRoom & { roomId: string } = {
      roomId: "new-room",
      userInfo: mockRecipient,
      messages: [],
      isGroup: false as const,
      groupInfo: null,
      usersInfo: null
    }

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

  test("createDMConversationAsync.rejected should set error", () => {
    const action = {
      type: createDMConversationAsync.rejected.type,
      error: { message: "Failed to create conversation" }
    }
    const state = messagesReducer(initialState, action)
    expect(state.loading).toBe(false)
    expect(state.error).toBe("Failed to create conversation")
  })

  test("createGroupConversationAsync.pending should set loading to true", () => {
    const action = { type: createGroupConversationAsync.pending.type }
    const state = messagesReducer(initialState, action)
    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  test("createGroupConversationAsync.fulfilled should create a new group", () => {
    const mockGroupInfo = {
      groupName: "New Test Group",
      groupImageHref: "new-group-image-url"
    }

    const mockUserInfos = [mockUser, mockRecipient]

    const mockResponse: GroupRoom & { roomId: string } = {
      roomId: "new-group",
      userInfo: null,
      messages: [],
      isGroup: true as const,
      groupInfo: mockGroupInfo,
      usersInfo: mockUserInfos
    }

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

  test("createGroupConversationAsync.rejected should set error", () => {
    const action = {
      type: createGroupConversationAsync.rejected.type,
      error: { message: "Failed to create group" }
    }
    const state = messagesReducer(initialState, action)
    expect(state.loading).toBe(false)
    expect(state.error).toBe("Failed to create group")
  })

  test("sendMessageAsync.pending should set loading to true", () => {
    const action = { type: sendMessageAsync.pending.type }
    const state = messagesReducer(initialState, action)
    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  test("sendMessageAsync.rejected should set error", () => {
    const action = {
      type: sendMessageAsync.rejected.type,
      error: { message: "Test error" }
    }
    const state = messagesReducer(initialState, action)
    expect(state.loading).toBe(false)
    expect(state.error).toBe("Test error")
  })
})
