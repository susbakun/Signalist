import { SignalModel } from "@/shared/models"
import {
  CoinType,
  RootState,
  SignalAccountType,
  SimplifiedAccountType,
  SignalsFilters
} from "@/shared/types"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import * as signalsApi from "@/services/signalsApi"
import { getUserByUsernameAsync } from "@/features/User/usersSlice"

// Define async thunks for API operations
export const fetchSignals = createAsyncThunk(
  "signals/fetchSignals",
  async ({
    page = 1,
    limit = 10,
    publishers,
    publisher,
    market,
    status,
    openFrom,
    openTo,
    closeFrom,
    closeTo
  }: {
    page?: number
    limit?: number
    publishers?: string[]
    publisher?: string
    market?: SignalsFilters["market"]
    status?: SignalsFilters["status"]
    openFrom?: SignalsFilters["openFrom"]
    openTo?: SignalsFilters["openTo"]
    closeFrom?: SignalsFilters["closeFrom"]
    closeTo?: SignalsFilters["closeTo"]
  } = {}) => {
    const isReset = page === 1
    return {
      ...(await signalsApi.fetchSignals(page, limit, {
        publishers,
        publisher,
        market,
        status,
        openFrom,
        openTo,
        closeFrom,
        closeTo
      })),
      isReset
    }
  }
)

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
        oldSignal.user.score !== updatedSignal.user.score &&
        updatedSignal.user.username
      ) {
        console.log(
          `Publisher score changed from ${oldSignal.user.score} to ${updatedSignal.user.score}`
        )

        // Fetch the latest user data to update the UI
        dispatch(getUserByUsernameAsync(updatedSignal.user.username))
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

// Update signal (description & closeTime)
export const updateSignalAsync = createAsyncThunk(
  "signals/updateSignal",
  async (data: {
    signalId: string
    description: string
    closeTime: number
    status?: SignalModel["status"]
  }) => {
    return await signalsApi.updateSignal(data.signalId, {
      description: data.description,
      closeTime: data.closeTime,
      status: data.status
    })
  }
)

// Add a new action to update signal publishers when a user profile is updated
export const updateSignalPublishersAsync = createAsyncThunk(
  "signals/updateSignalPublishers",
  async (userData: SimplifiedAccountType & { score: number }) => {
    return userData
  }
)

// Define the state type
interface SignalsState {
  signals: SignalModel[]
  loading: boolean
  applyingFilters: boolean
  error: string | null
  page: number
  hasMore: boolean
  totalCount: number
  filters: SignalsFilters
}

// Initial state now includes loading and error states
const initialState: SignalsState = {
  signals: [],
  loading: false,
  applyingFilters: false,
  error: null,
  page: 1,
  hasMore: true,
  totalCount: 0,
  filters: {}
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
            ...signal.user,
            score: signal.user.score + score
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
    },
    updatePage: (state, action) => {
      state.page = action.payload
    },
    setSignalsFilters: (state, action: { payload: SignalsFilters }) => {
      state.filters = action.payload
      state.applyingFilters = true
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
        state.applyingFilters = false

        // If we're resetting (page 1), replace all signals
        if (action.payload.isReset) {
          state.signals = action.payload.data
          state.page = 1
        } else {
          // Check for duplicates before adding new signals
          const existingSignalIds = new Set(state.signals.map((signal) => signal.id))
          const newSignals = action.payload.data.filter(
            (signal) => !existingSignalIds.has(signal.id)
          )

          // Only add signals that don't already exist
          state.signals = [...state.signals, ...newSignals]

          // If we got no new signals, we've reached the end
          if (newSignals.length === 0) {
            state.hasMore = false
          } else {
            state.hasMore = action.payload.hasMore
          }
        }
        state.totalCount = action.payload.totalCount
        state.hasMore = action.payload.hasMore
      })
      .addCase(fetchSignals.rejected, (state, action) => {
        state.loading = false
        state.applyingFilters = false
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

      // Update signal publishers
      .addCase(updateSignalPublishersAsync.fulfilled, (state, action) => {
        // Update publisher info in all signals where this user is the publisher
        state.signals = state.signals.map((signal) => {
          if (signal.user.username === action.payload.username) {
            return {
              ...signal,
              publisher: {
                ...signal.user,
                username: action.payload.username,
                name: action.payload.name,
                imageUrl: action.payload.imageUrl,
                // Keep the original score since that's separately managed
                score: signal.user.score
              }
            }
          }
          return signal
        })
      })

      // Update signal (description & closeTime)
      .addCase(updateSignalAsync.fulfilled, (state, action) => {
        const index = state.signals.findIndex((signal) => signal.id === action.payload.id)
        if (index !== -1) {
          state.signals[index] = action.payload
        }
      })
  }
})

export const { updateSignalsState, updatePage, setSignalsFilters } = signalsSlice.actions
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default signalsSlice.reducer
