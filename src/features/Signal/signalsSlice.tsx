import { signalsMock } from "@/assets/mocks"
import { SignalModel } from "@/shared/models"
import { CoinType } from "@/shared/types"
import { createSlice } from "@reduxjs/toolkit"
import { v4 } from "uuid"

const initialState = signalsMock

const signalsSlice = createSlice({
  name: "signals",
  initialState,
  reducers: {
    createSignal: (state, action) => {
      const newSignal: SignalModel = {
        id: v4(),
        date: new Date().getTime(),
        openTime: action.payload.openTime,
        closeTime: action.payload.closeTime,
        publisher: action.payload.publisher,
        status: action.payload.status,
        isPremium: action.payload.isPremium,
        likes: 0,
        market: action.payload.market,
        entry: action.payload.entry,
        stoploss: action.payload.stoploss,
        targets: action.payload.targets,
        description: action.payload.description
      }
      if (action.payload.chartImageId) {
        newSignal.chartImageId = action.payload.chartImageId
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
    updateSignalsState: (state, action) => {
      const currentTime = new Date().getTime()
      return state.map((signal) => {
        const marketName = signal.market.name.split("/")[0]
        if (signal.status === "open" && currentTime - signal.closeTime >= -1000) {
          const currentPrice = action.payload.coins.find(
            (crypto: CoinType) => crypto.symbol === marketName
          )?.price
          let score = 0
          const updatedTargets = signal.targets.map((target) => {
            if (parseFloat(currentPrice) >= target.value) {
              score += 1
              return { ...target, touched: true }
            }
            return target
          })
          const publisherWithUpdatedScore = {
            ...signal.publisher,
            score: signal.publisher.score + score
          }
          return {
            ...signal,
            publisher: publisherWithUpdatedScore,
            targets: updatedTargets,
            status: "closed"
          }
        } else if (signal.status === "not_opened" && currentTime - signal.openTime >= -1000) {
          return { ...signal, status: "open" }
        }
        return signal
      })
    }
  }
})

export const { createSignal, likeSignal, dislikeSignal, updateSignalsState } = signalsSlice.actions
export default signalsSlice.reducer
