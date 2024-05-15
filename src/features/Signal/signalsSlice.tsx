import { signalsMock } from '@/assets/mocks'
import { createSlice } from '@reduxjs/toolkit'

const initialState = signalsMock

const signalsSlice = createSlice({
  name: 'signals',
  initialState,
  reducers: {
    likeSignal: (state, action) => {
      return state.map((signal) => {
        if (signal.id === action.payload.id) {
          return { ...signal, likes: signal.likes + 1 }
        }
        return signal
      })
    },
    dislikeSignal: (state, action) => {
      return state.map((signal) => {
        if (signal.id === action.payload.id) {
          return { ...signal, likes: signal.likes - 1 }
        }
        return signal
      })
    }
  }
})

export const { likeSignal, dislikeSignal } = signalsSlice.actions
export default signalsSlice.reducer
