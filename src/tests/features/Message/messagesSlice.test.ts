import messagesReducer, {
  createGroup,
  createRoom,
  sendMessage
} from "@/features/Message/messagesSlice"

describe("messagesSlice", () => {
  // Mock the initial state
  const initialState = {
    testuser: {}
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
    expect(messagesReducer(undefined, { type: "unknown" })).toEqual(expect.any(Object))
  })

  test("should handle createRoom", () => {
    const action = createRoom({
      myUsername: "testuser",
      roomId: "room1",
      userInfo: mockRecipient
    })

    const state = messagesReducer(initialState, action)

    expect(state.testuser.room1).toBeDefined()
    expect(state.testuser.room1.isGroup).toBe(false)
    expect(state.testuser.room1.userInfo).toEqual(mockRecipient)
    expect(state.testuser.room1.messages).toEqual([])
    expect(state.testuser.room1.groupInfo).toBeNull()
    expect(state.testuser.room1.usersInfo).toBeNull()
  })

  test("should handle createGroup", () => {
    const mockGroupInfo = {
      groupName: "Test Group",
      groupImageId: "group-image-id"
    }

    const mockUserInfos = [mockUser, mockRecipient]

    const action = createGroup({
      myUsername: "testuser",
      roomId: "group1",
      userInfos: mockUserInfos,
      groupInfo: mockGroupInfo
    })

    const state = messagesReducer(initialState, action)

    expect(state.testuser.group1).toBeDefined()
    expect(state.testuser.group1.isGroup).toBe(true)
    expect(state.testuser.group1.groupInfo).toEqual(mockGroupInfo)
    expect(state.testuser.group1.usersInfo).toEqual(mockUserInfos)
    expect(state.testuser.group1.messages).toEqual([])
    expect(state.testuser.group1.userInfo).toBeNull()
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
      recipient: {}
    }

    // Then send a message
    const action = sendMessage({
      sender: mockUser,
      roomId: "room1",
      text: "Hello, recipient!"
    })

    state = messagesReducer(state, action)

    // Check if message was added to sender's room
    expect(state.testuser.room1.messages.length).toBe(1)
    expect(state.testuser.room1.messages[0].text).toBe("Hello, recipient!")
    expect(state.testuser.room1.messages[0].sender).toEqual(mockUser)
    expect(state.testuser.room1.messages[0].date).toEqual(expect.any(Number))

    // Check if message was added to recipient's room
    expect(state.recipient.room1).toBeDefined()
    expect(state.recipient.room1.messages.length).toBe(1)
    expect(state.recipient.room1.messages[0].text).toBe("Hello, recipient!")
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
      recipient: {}
    }

    // Then send a message with an image
    const action = sendMessage({
      sender: mockUser,
      roomId: "room1",
      text: "Check out this image!",
      messageImageId: "image-123"
    })

    state = messagesReducer(state, action)

    // Check if message was added with image
    expect(state.testuser.room1.messages[0].messageImageId).toBe("image-123")
    expect(state.recipient.room1.messages[0].messageImageId).toBe("image-123")
  })

  test("should handle sendMessage in a group", () => {
    const mockGroupInfo = {
      groupName: "Test Group",
      groupImageId: "group-image-id"
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
      recipient: {},
      member: {}
    }

    // Then send a message to the group
    const action = sendMessage({
      sender: mockUser,
      roomId: "group1",
      text: "Hello, group!"
    })

    state = messagesReducer(state, action)

    // Check if message was added to sender's room
    expect(state.testuser.group1.messages.length).toBe(1)
    expect(state.testuser.group1.messages[0].text).toBe("Hello, group!")

    // Check if message was added to all group members' rooms
    expect(state.recipient.group1).toBeDefined()
    expect(state.recipient.group1.messages.length).toBe(1)
    expect(state.recipient.group1.messages[0].text).toBe("Hello, group!")

    expect(state.member.group1).toBeDefined()
    expect(state.member.group1.messages.length).toBe(1)
    expect(state.member.group1.messages[0].text).toBe("Hello, group!")
  })

  test("should create a new room for recipient if it doesn't exist", () => {
    // Start with a state that doesn't have the recipient
    const state = {
      testuser: {},
      recipient: {}
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
    expect(newState.recipient).toBeDefined()
    expect(newState.recipient.room1).toBeDefined()
    expect(newState.recipient.room1.userInfo?.username).toBe("testuser")
    expect(newState.recipient.room1.messages.length).toBe(1)
    expect(newState.recipient.room1.messages[0].text).toBe("Hello, new recipient!")
  })

  test("should create a new room for group member if it doesn't exist", () => {
    const mockGroupInfo = {
      groupName: "Test Group",
      groupImageId: "group-image-id"
    }

    const mockNewMember = {
      username: "newmember",
      name: "New Member",
      imageUrl: "new-image.jpg"
    }

    const mockUserInfos = [mockUser, mockRecipient, mockNewMember]

    // Start with a state that doesn't have the new member
    const state = {
      testuser: {},
      recipient: {}
    }

    // Create a group for the sender
    let newState = messagesReducer(
      state,
      createGroup({
        myUsername: "testuser",
        roomId: "group1",
        userInfos: mockUserInfos,
        groupInfo: mockGroupInfo
      })
    )

    // Send a message to the group
    const action = sendMessage({
      sender: mockUser,
      roomId: "group1",
      text: "Welcome to the group!"
    })

    newState = messagesReducer(newState, action)

    // Check if a new room was created for the new member
    expect(newState.newmember).toBeDefined()
    expect(newState.newmember.group1).toBeDefined()
    expect(newState.newmember.group1.isGroup).toBe(true)
    expect(newState.newmember.group1.groupInfo).toEqual(mockGroupInfo)
    expect(newState.newmember.group1.messages.length).toBe(1)
    expect(newState.newmember.group1.messages[0].text).toBe("Welcome to the group!")
  })
})
