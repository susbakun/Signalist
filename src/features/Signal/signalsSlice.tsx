import { signalsMock } from '@/assets/mocks'
import { SignalModel } from '@/shared/models'
import { createSlice } from '@reduxjs/toolkit'
import { v4 } from 'uuid'

const initialState = signalsMock

const signalsSlice = createSlice({
  name: 'signals',
  initialState,
  reducers: {
    createSignal: (state, action) => {
      const newSignal: SignalModel = {
        id: v4(),
        date: new Date().getTime(),
        openTime: action.payload.openTime,
        closeTime: action.payload.closeTime,
        publisher: action.payload.publisher,
        showChart: action.payload.showChart,
        status: action.payload.status,
        likes: 0,
        market: action.payload.market,
        entry: action.payload.entry,
        stoploss: action.payload.stoploss,
        targets: action.payload.targets,
        description: action.payload.description
      }
      state.push(newSignal)
    },
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
    },
    updateStates: (state) => {
      const currentTime = new Date().getTime()
      return state.map((signal) => {
        if (signal.status === 'open' && currentTime - signal.closeTime >= -1000) {
          return { ...signal, status: 'closed' }
        } else if (signal.status === 'not_opened' && currentTime - signal.openTime >= -1000) {
          return { ...signal, status: 'open' }
        }
        return signal
      })
    }
  }
})

export const { createSignal, likeSignal, dislikeSignal, updateStates } = signalsSlice.actions
export default signalsSlice.reducer
