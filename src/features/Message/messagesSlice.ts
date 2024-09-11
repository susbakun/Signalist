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
      state[action.payload.sender.username][action.payload.roomId]["messages"] = [
        ...state[action.payload.sender.username][action.payload.roomId]["messages"],
        newMessage
      ]
    }
  }
})

export const { sendMessage, createRoom, createGroup } = messagesSlice.actions
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default messagesSlice.reducer
