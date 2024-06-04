import { messagesMock } from '@/assets/mocks'
import { RootState } from '@/shared/types'
import { createSlice } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { v4 } from 'uuid'

const initialState = messagesMock

const messagesSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    createRoom: (state, action) => {
      state[action.payload.username][v4()] = { userInfo: action.payload.userInfo, messages: [] }
    },
    sendMessage: (state, action) => {
      const newMessage = {
        sender: action.payload.sender,
        date: new Date().getTime(),
        text: action.payload.text
      }
      state[action.payload.sender.username][action.payload.roomId]['messages'] = [
        ...state[action.payload.sender.username][action.payload.roomId]['messages'],
        newMessage
      ]
    }
  }
})

export const { sendMessage, createRoom } = messagesSlice.actions
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default messagesSlice.reducer