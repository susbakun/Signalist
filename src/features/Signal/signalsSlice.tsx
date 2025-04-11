import { SignalModel } from "@/shared/models"
import { CoinType, RootState, SignalAccountType, SimplifiedAccountType } from "@/shared/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import * as signalsApi from "@/services/signalsApi"
import { getUserByUsernameAsync } from "@/features/User/usersSlice"

// Define async thunks for API operations
export const fetchSignals = createAsyncThunk("signals/fetchSignals", async () => {
  return await signalsApi.fetchSignals()
})

export const createSignalAsync = createAsyncThunk(
  "signals/createSignal",
  async (signalData: {
    market: SignalModel["market"]
    entry: number
    stoploss: number
    targets: SignalModel["targets"]
    openTime: number
    closeTime: number
    status: SignalModel["status"]
    isPremium: boolean
    description?: string
    chartImageHref?: string
    publisher: SignalAccountType
  }) => {
    return await signalsApi.createSignal(signalData)
  }
)

export const updateSignalStatusAsync = createAsyncThunk(
  "signals/updateSignalStatus",
  async ({ signalId }: { signalId: string }, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const oldSignal = state.signals.signals.find((signal) => signal.id === signalId)
      const updatedSignal = await signalsApi.updateSignalStatus(signalId)

      // If there's an old signal and a publisher score change, update the user data
      if (
        oldSignal &&
        oldSignal.publisher.score !== updatedSignal.publisher.score &&
        updatedSignal.publisher.username
      ) {
        console.log(
          `Publisher score changed from ${oldSignal.publisher.score} to ${updatedSignal.publisher.score}`
        )

        // Fetch the latest user data to update the UI
        dispatch(getUserByUsernameAsync(updatedSignal.publisher.username))
      }

      return updatedSignal
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.toString() : String(error))
    }
  }
)

export const likeSignalAsync = createAsyncThunk(
  "signals/likeSignal",
  async (data: { signalId: string; user: SimplifiedAccountType }) => {
    return await signalsApi.likeSignal(data.signalId, data.user)
  }
)

export const dislikeSignalAsync = createAsyncThunk(
  "signals/dislikeSignal",
  async (data: { signalId: string; user: SimplifiedAccountType }) => {
    return await signalsApi.dislikeSignal(data.signalId, data.user)
  }
)

export const removeSignalAsync = createAsyncThunk("signals/removeSignal", async (id: string) => {
  await signalsApi.removeSignal(id)
  return id
})

// Define the state type
interface SignalsState {
  signals: SignalModel[]
  loading: boolean
  error: string | null
}

// Initial state now includes loading and error states
const initialState: SignalsState = {
  signals: [],
  loading: false,
  error: null
}

const signalsSlice = createSlice({
  name: "signals",
  initialState,
  reducers: {
    updateSignalsState: (state, action) => {
      const currentTime = new Date().getTime()
      state.signals = state.signals.map((signal) => {
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
  },
  extraReducers: (builder) => {
    builder
      // Fetch signals
      .addCase(fetchSignals.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSignals.fulfilled, (state, action) => {
        state.loading = false
        state.signals = action.payload
      })
      .addCase(fetchSignals.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch signals"
      })

      // Create signal
      .addCase(createSignalAsync.fulfilled, (state, action) => {
        state.signals.push(action.payload)
      })

      // Update signal status
      .addCase(updateSignalStatusAsync.fulfilled, (state, action) => {
        const index = state.signals.findIndex((signal) => signal.id === action.payload.id)
        if (index !== -1) {
          state.signals[index] = action.payload
        }
      })

      // Like signal
      .addCase(likeSignalAsync.fulfilled, (state, action) => {
        const index = state.signals.findIndex((signal) => signal.id === action.payload.id)
        if (index !== -1) {
          state.signals[index] = action.payload
        }
      })

      // Dislike signal
      .addCase(dislikeSignalAsync.fulfilled, (state, action) => {
        const index = state.signals.findIndex((signal) => signal.id === action.payload.id)
        if (index !== -1) {
          state.signals[index] = action.payload
        }
      })

      // Remove signal
      .addCase(removeSignalAsync.fulfilled, (state, action) => {
        state.signals = state.signals.filter((signal) => signal.id !== action.payload)
      })
  }
})

export const { updateSignalsState } = signalsSlice.actions
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default signalsSlice.reducer
