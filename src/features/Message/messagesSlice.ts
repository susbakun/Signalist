import { messagesMock } from "@/assets/mocks"
import { ChatType, RootState } from "@/shared/types"
import { createSlice } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"

const initialState = messagesMock

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    createRoom: (state, action) => {
      state[action.payload.myUsername][action.payload.roomId] = {
        userInfo: action.payload.userInfo,
        messages: [],
        groupInfo: null,
        usersInfo: null,
        isGroup: false
      }
    },
    createGroup: (state, action) => {
      state[action.payload.myUsername][action.payload.roomId] = {
        usersInfo: action.payload.userInfos,
        messages: [],
        groupInfo: action.payload.groupInfo,
        userInfo: null,
        isGroup: true
      }
    },
    sendMessage: (state, action) => {
      const newMessage: ChatType = {
        sender: action.payload.sender,
        date: new Date().getTime(),
        text: action.payload.text
      }

      if (action.payload.messageImageId) {
        newMessage.messageImageId = action.payload.messageImageId
      }

      state[action.payload.sender.username][action.payload.roomId].messages.push(newMessage)

      const currentRoom = state[action.payload.sender.username][action.payload.roomId]

      if (!currentRoom.isGroup) {
        const recipientUsername = currentRoom.userInfo.username

        if (state[recipientUsername] && state[recipientUsername][action.payload.roomId]) {
          state[recipientUsername][action.payload.roomId].messages.push(newMessage)
        } else {
          state[recipientUsername] = {
            ...state[recipientUsername],
            [action.payload.roomId]: {
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
        }
      } else {
        const groupMembers = currentRoom.usersInfo

        if (groupMembers) {
          groupMembers.forEach((member) => {
            if (member.username !== action.payload.sender.username) {
              if (state[member.username] && state[member.username][action.payload.roomId]) {
                state[member.username][action.payload.roomId].messages.push(newMessage)
              } else {
                state[member.username] = {
                  ...state[member.username],
                  [action.payload.roomId]: {
                    userInfo: null,
                    messages: [newMessage],
                    isGroup: true,
                    groupInfo: currentRoom.groupInfo,
                    usersInfo: currentRoom.usersInfo
                  }
                }
              }
            }
          })
        }
      }
    }
  }
})

export const { sendMessage, createRoom, createGroup } = messagesSlice.actions
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default messagesSlice.reducer
