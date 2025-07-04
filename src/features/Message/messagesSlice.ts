import { ChatType, DMRoom, GroupRoom, RootState, SimplifiedAccountType } from "@/shared/types"
import { MessageModel } from "@/shared/models"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import * as messagesApi from "@/services/messagesApi"
import { Socket } from "socket.io-client"
import { v4 } from "uuid"

// Define the state interface with loading and error properties
interface MessagesState {
  conversations: MessageModel
  loading: boolean
  error: string | null
  socket: Socket | null
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

// Add a new action to update message publishers when a user profile is updated
export const updateMessageSendersReceiversAsync = createAsyncThunk(
  "messages/updateMessageSendersReceivers",
  async (userData: SimplifiedAccountType) => {
    return userData
  }
)

export interface SendMessagePayload {
  sender: SimplifiedAccountType
  roomId: string
  text: string
  messageImageHref?: string
  date?: number
  id?: string
  pending?: boolean
  error?: boolean
}

// Empty initial state instead of mock data
const initialState: MessagesState = {
  conversations: {},
  loading: false,
  error: null,
  socket: null
}

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    getNewMessage: (state, action) => {
      const { currentUser, messageRoomId, text, sender } = action.payload

      console.log("getNewMessage dispatched with:", {
        currentUser: currentUser.username,
        messageRoomId,
        text,
        sender: sender?.username
      })

      // Use the sender from the payload if provided (for incoming messages), otherwise use currentUser
      const messageSender = sender || currentUser

      const newMessage: ChatType = {
        sender: messageSender,
        text,
        messageImageHref: "",
        date: Date.now(),
        id: v4()
      }

      // Check if the conversation exists for the current user
      if (
        state.conversations[currentUser.username] &&
        state.conversations[currentUser.username][messageRoomId]
      ) {
        console.log("Adding message to conversation:", messageRoomId)
        state.conversations[currentUser.username][messageRoomId].messages = [
          ...state.conversations[currentUser.username][messageRoomId].messages,
          newMessage
        ]
      } else {
        console.error("Conversation not found:", {
          user: currentUser.username,
          roomId: messageRoomId,
          hasConversations: !!state.conversations[currentUser.username],
          availableRooms: state.conversations[currentUser.username]
            ? Object.keys(state.conversations[currentUser.username])
            : []
        })
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
      .addCase(sendMessageAsync.fulfilled, (state, action) => {
        state.loading = false
        const { text, sender, roomId } = action.meta.arg

        const newMessage: ChatType = {
          sender,
          text,
          messageImageHref: "",
          date: Date.now(),
          id: v4()
        }

        state.conversations[sender.username][roomId].messages = [
          ...state.conversations[sender.username][roomId].messages,
          newMessage
        ]
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

      // Update message senders and receivers - fulfilled
      .addCase(updateMessageSendersReceiversAsync.fulfilled, (state, action) => {
        const username = action.payload.username

        // Iterate through all user conversations
        Object.keys(state.conversations).forEach((userKey) => {
          const userConversations = state.conversations[userKey]

          // Iterate through each room in the user's conversations
          Object.keys(userConversations).forEach((roomId) => {
            const room = userConversations[roomId]

            // Update sender in DM rooms
            if (!room.isGroup && room.userInfo) {
              if (room.userInfo.username === username) {
                room.userInfo = action.payload
              }
            }

            // Update members in group rooms
            if (room.isGroup && room.usersInfo) {
              room.usersInfo = room.usersInfo.map((member) =>
                member.username === username ? action.payload : member
              )
            }

            // Update message senders
            if (room.messages) {
              room.messages = room.messages.map((message) => {
                if (message.sender.username === username) {
                  return {
                    ...message,
                    sender: action.payload
                  }
                }
                return message
              })
            }
          })
        })
      })
  }
})

export const { getNewMessage } = messagesSlice.actions
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default messagesSlice.reducer
