import { ChatType, DMRoom, GroupRoom, RootState, SimplifiedAccountType } from "@/shared/types"
import { MessageModel } from "@/shared/models"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import * as messagesApi from "@/services/messagesApi"

// Define the state interface with loading and error properties
interface MessagesState {
  conversations: MessageModel
  loading: boolean
  error: string | null
}

// Define async thunks for API operations
export const fetchUserConversations = createAsyncThunk<
  Record<string, DMRoom | GroupRoom>, // Response type
  string // Arg type (username)
>("messages/fetchUserConversations", async (username: string) => {
  return await messagesApi.getUserConversations(username)
})

export const fetchConversationMessages = createAsyncThunk<
  ChatType[], // Response type
  string // Arg type (roomId)
>("messages/fetchConversationMessages", async (roomId: string) => {
  return await messagesApi.getConversationMessages(roomId)
})

export const sendMessageAsync = createAsyncThunk<
  ChatType, // Response type
  {
    sender: SimplifiedAccountType
    roomId: string
    text: string
    messageImageHref?: string
  }
>(
  "messages/sendMessage",
  async (data: {
    sender: SimplifiedAccountType
    roomId: string
    text: string
    messageImageHref?: string
  }) => {
    const { sender, roomId, text, messageImageHref } = data
    return await messagesApi.sendMessage(roomId, sender, text, messageImageHref)
  }
)

export const createDMConversationAsync = createAsyncThunk<
  DMRoom & { roomId: string }, // Response type
  { user1: SimplifiedAccountType; user2: SimplifiedAccountType }
>(
  "messages/createDMConversation",
  async (data: { user1: SimplifiedAccountType; user2: SimplifiedAccountType }) => {
    const { user1, user2 } = data
    return (await messagesApi.createDMConversation(user1, user2)) as DMRoom & { roomId: string }
  }
)

export const createGroupConversationAsync = createAsyncThunk<
  GroupRoom & { roomId: string }, // Response type
  {
    groupName: string
    members: SimplifiedAccountType[]
    createdBy: SimplifiedAccountType
  }
>(
  "messages/createGroupConversation",
  async (data: {
    groupName: string
    members: SimplifiedAccountType[]
    createdBy: SimplifiedAccountType
  }) => {
    const { groupName, members, createdBy } = data
    return (await messagesApi.createGroupConversation(
      groupName,
      members,
      createdBy
    )) as GroupRoom & { roomId: string }
  }
)

// Define interfaces for action payloads to improve type safety
interface CreateRoomPayload {
  myUsername: string
  roomId: string
  userInfo: SimplifiedAccountType
}

interface CreateGroupPayload {
  myUsername: string
  roomId: string
  userInfos: SimplifiedAccountType[]
  groupInfo: {
    groupName: string
    groupImageHref?: string
  }
}

export interface SendMessagePayload {
  sender: SimplifiedAccountType
  roomId: string
  text: string
  messageImageHref?: string
}

// Empty initial state instead of mock data
const initialState: MessagesState = {
  conversations: {},
  loading: false,
  error: null
}

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    // Keep these for fallback in case API fails
    createRoom: (state, action: PayloadAction<CreateRoomPayload>) => {
      if (!state.conversations[action.payload.myUsername]) {
        state.conversations[action.payload.myUsername] = {}
      }

      state.conversations[action.payload.myUsername][action.payload.roomId] = {
        userInfo: action.payload.userInfo,
        messages: [],
        groupInfo: null,
        usersInfo: null,
        isGroup: false
      }
    },
    createGroup: (state, action: PayloadAction<CreateGroupPayload>) => {
      if (!state.conversations[action.payload.myUsername]) {
        state.conversations[action.payload.myUsername] = {}
      }

      state.conversations[action.payload.myUsername][action.payload.roomId] = {
        usersInfo: action.payload.userInfos,
        messages: [],
        groupInfo: action.payload.groupInfo,
        userInfo: null,
        isGroup: true
      }
    },
    sendMessage: (state, action: PayloadAction<SendMessagePayload>) => {
      const newMessage: ChatType = {
        sender: action.payload.sender,
        date: new Date().getTime(),
        text: action.payload.text
      }

      if (action.payload.messageImageHref) {
        newMessage.messageImageHref = action.payload.messageImageHref
      }

      // Create sender structure if it doesn't exist
      if (!state.conversations[action.payload.sender.username]) {
        state.conversations[action.payload.sender.username] = {}
      }

      // Create the room if it doesn't exist yet
      if (!state.conversations[action.payload.sender.username][action.payload.roomId]) {
        return // Can't send to a room that doesn't exist
      }

      state.conversations[action.payload.sender.username][action.payload.roomId].messages.push(
        newMessage
      )

      const currentRoom = state.conversations[action.payload.sender.username][action.payload.roomId]

      if (!currentRoom.isGroup) {
        // Make sure user info exists
        if (!currentRoom.userInfo) {
          return // Invalid room structure
        }

        const recipientUsername = currentRoom.userInfo.username

        if (
          state.conversations[recipientUsername] &&
          state.conversations[recipientUsername][action.payload.roomId]
        ) {
          state.conversations[recipientUsername][action.payload.roomId].messages.push(newMessage)
        } else {
          if (!state.conversations[recipientUsername]) {
            state.conversations[recipientUsername] = {}
          }

          state.conversations[recipientUsername][action.payload.roomId] = {
            userInfo: {
              name: action.payload.sender.name,
              username: action.payload.sender.username,
              imageUrl: action.payload.sender.imageUrl
            },
            messages: [newMessage],
            isGroup: false,
            groupInfo: null,
            usersInfo: null
          }
        }
      } else {
        const groupMembers = currentRoom.usersInfo

        if (groupMembers) {
          groupMembers.forEach((member) => {
            if (member.username !== action.payload.sender.username) {
              if (!state.conversations[member.username]) {
                state.conversations[member.username] = {}
              }

              if (
                state.conversations[member.username] &&
                state.conversations[member.username][action.payload.roomId]
              ) {
                state.conversations[member.username][action.payload.roomId].messages.push(
                  newMessage
                )
              } else {
                state.conversations[member.username][action.payload.roomId] = {
                  userInfo: null,
                  messages: [newMessage],
                  isGroup: true,
                  groupInfo: currentRoom.groupInfo,
                  usersInfo: currentRoom.usersInfo
                }
              }
            }
          })
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user conversations - pending
      .addCase(fetchUserConversations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      // Fetch user conversations - fulfilled
      .addCase(fetchUserConversations.fulfilled, (state, action) => {
        state.loading = false
        // If we have conversations for this user, update them
        if (action.payload) {
          if (!state.conversations[action.meta.arg]) {
            state.conversations[action.meta.arg] = {}
          }
          state.conversations[action.meta.arg] = action.payload
        }
      })
      // Fetch user conversations - rejected
      .addCase(fetchUserConversations.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch conversations"
      })

      // Fetch conversation messages - pending
      .addCase(fetchConversationMessages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      // Fetch conversation messages - fulfilled
      .addCase(fetchConversationMessages.fulfilled, (state) => {
        state.loading = false
        // This won't update the state directly as we need to know which user and room to update
        // The component using this will need to handle the messages separately
      })
      // Fetch conversation messages - rejected
      .addCase(fetchConversationMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch messages"
      })

      // Send message - pending
      .addCase(sendMessageAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      // Send message - fulfilled
      .addCase(sendMessageAsync.fulfilled, (state) => {
        state.loading = false
        // When a message is sent via API, it would come back via socket.io
        // So we don't need to update here
      })
      // Send message - rejected
      .addCase(sendMessageAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to send message"
      })

      // Create DM conversation - pending
      .addCase(createDMConversationAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      // Create DM conversation - fulfilled
      .addCase(createDMConversationAsync.fulfilled, (state, action) => {
        state.loading = false
        const myUsername = action.meta.arg.user1.username
        const roomId = action.payload.roomId

        if (!state.conversations[myUsername]) {
          state.conversations[myUsername] = {}
        }

        state.conversations[myUsername][roomId] = action.payload
      })
      // Create DM conversation - rejected
      .addCase(createDMConversationAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create conversation"
      })

      // Create group conversation - pending
      .addCase(createGroupConversationAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      // Create group conversation - fulfilled
      .addCase(createGroupConversationAsync.fulfilled, (state, action) => {
        state.loading = false
        const myUsername = action.meta.arg.createdBy.username
        const roomId = action.payload.roomId

        if (!state.conversations[myUsername]) {
          state.conversations[myUsername] = {}
        }

        state.conversations[myUsername][roomId] = action.payload
      })
      // Create group conversation - rejected
      .addCase(createGroupConversationAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create group"
      })
  }
})

export const { sendMessage, createRoom, createGroup } = messagesSlice.actions
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default messagesSlice.reducer
