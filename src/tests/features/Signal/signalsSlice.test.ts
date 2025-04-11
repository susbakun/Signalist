import signalsReducer, {
  createSignalAsync,
  dislikeSignalAsync,
  likeSignalAsync,
  updateSignalStatusAsync
} from "@/features/Signal/signalsSlice"
import { SimplifiedAccountType, StatusType } from "@/shared/types"
import { vi } from "vitest"

// Mock uuid generation
vi.mock("uuid", () => ({
  v4: vi.fn().mockReturnValue("mocked-uuid")
}))

describe("signalsSlice", () => {
  const mockUser: SimplifiedAccountType = {
    username: "testuser",
    name: "Test User",
    imageUrl: "test-image.jpg"
  }

  const mockPublisher = {
    username: "publisher",
    name: "Publisher",
    imageUrl: "publisher-image.jpg",
    score: 100
  }

  const initialState = {
    signals: [
      {
        id: "1",
        market: {
          name: "BTC/USD",
          uuid: "bitcoin-uuid"
        },
        entry: 50000,
        stoploss: 48000,
        targets: [
          { id: "t1", value: 52000, touched: false },
          { id: "t2", value: 55000, touched: false }
        ],
        openTime: Date.now() + 3600000, // 1 hour in the future
        closeTime: Date.now() + 86400000, // 24 hours in the future
        status: "not_opened" as StatusType,
        date: Date.now() - 3600000, // 1 hour ago
        likes: [],
        description: "Test signal",
        isPremium: false,
        publisher: mockPublisher
      }
    ],
    loading: false,
    error: null
  }

  test("should handle initial state", () => {
    expect(signalsReducer(undefined, { type: "unknown" })).toEqual({
      signals: [],
      loading: false,
      error: null
    })
  })

  test("should handle createSignalAsync.fulfilled", () => {
    const newSignal = {
      openTime: Date.now() + 3600000,
      closeTime: Date.now() + 86400000,
      publisher: mockPublisher,
      status: "not_opened" as StatusType,
      isPremium: false,
      market: {
        name: "ETH/USD",
        uuid: "ethereum-uuid"
      },
      entry: 3000,
      stoploss: 2800,
      targets: [
        { id: "t1", value: 3200, touched: false },
        { id: "t2", value: 3500, touched: false }
      ],
      description: "New test signal"
    }

    const action = {
      type: createSignalAsync.fulfilled.type,
      payload: {
        id: "mocked-uuid",
        date: expect.any(Number),
        likes: [],
        ...newSignal
      }
    }
    const state = signalsReducer(initialState, action)

    expect(state.signals.length).toBe(2)
    expect(state.signals[1]).toEqual(action.payload)
  })

  test("should handle createSignalAsync.fulfilled with chart image", () => {
    const newSignal = {
      openTime: Date.now() + 3600000,
      closeTime: Date.now() + 86400000,
      publisher: mockPublisher,
      status: "not_opened" as StatusType,
      isPremium: false,
      market: {
        name: "ETH/USD",
        uuid: "ethereum-uuid"
      },
      entry: 3000,
      stoploss: 2800,
      targets: [
        { id: "t1", value: 3200, touched: false },
        { id: "t2", value: 3500, touched: false }
      ],
      description: "New test signal with chart",
      chartImageHref: "chart-123.png"
    }

    const action = {
      type: createSignalAsync.fulfilled.type,
      payload: {
        id: "mocked-uuid",
        date: expect.any(Number),
        likes: [],
        ...newSignal
      }
    }
    const state = signalsReducer(initialState, action)

    expect(state.signals.length).toBe(2)
    expect(state.signals[1].chartImageHref).toBe("chart-123.png")
  })

  test("should handle likeSignalAsync.fulfilled", () => {
    const action = {
      type: likeSignalAsync.fulfilled.type,
      payload: {
        signalId: "1",
        likes: [mockUser]
      }
    }
    const state = signalsReducer(initialState, action)

    expect(state.signals[0].likes).toContainEqual(mockUser)
    expect(state.signals[0].likes.length).toBe(1)
  })

  test("should handle dislikeSignalAsync.fulfilled", () => {
    const action = {
      type: dislikeSignalAsync.fulfilled.type,
      payload: {
        signalId: "1",
        likes: []
      }
    }
    const state = signalsReducer(initialState, action)

    expect(state.signals[0].likes).not.toContainEqual(mockUser)
    expect(state.signals[0].likes.length).toBe(0)
  })

  test("should handle updateSignalStatusAsync.fulfilled for not_opened signals", () => {
    // Mock the current time to be after the openTime
    const mockCurrentTime = initialState.signals[0].openTime + 1000
    const originalDate = Date.now
    Date.now = vi.fn().mockReturnValue(mockCurrentTime)

    const action = {
      type: updateSignalStatusAsync.fulfilled.type,
      payload: {
        signals: [
          {
            ...initialState.signals[0],
            status: "open" as StatusType
          }
        ]
      }
    }
    const state = signalsReducer(initialState, action)

    // Signal should now be open
    expect(state.signals[0].status).toBe("open")

    // Restore the original Date.now
    Date.now = originalDate
  })

  test("should handle updateSignalStatusAsync.fulfilled for open signals", () => {
    // Create a signal that's already open
    const openSignal = {
      ...initialState.signals[0],
      status: "open" as StatusType,
      openTime: Date.now() - 3600000, // 1 hour ago
      closeTime: Date.now() + 1000 // Just about to close
    }

    // Mock the current time to be after the closeTime
    const mockCurrentTime = openSignal.closeTime + 1000
    const originalDate = Date.now
    Date.now = vi.fn().mockReturnValue(mockCurrentTime)

    const action = {
      type: updateSignalStatusAsync.fulfilled.type,
      payload: {
        signals: [
          {
            ...openSignal,
            status: "closed" as StatusType,
            targets: [
              { id: "t1", value: 52000, touched: true },
              { id: "t2", value: 55000, touched: false }
            ],
            publisher: {
              ...mockPublisher,
              score: 101
            }
          }
        ]
      }
    }
    const state = signalsReducer({ ...initialState, signals: [openSignal] }, action)

    // Signal should now be closed
    expect(state.signals[0].status).toBe("closed")

    // First target should be marked as touched
    expect(state.signals[0].targets[0].touched).toBe(true)

    // Second target should not be touched (price not high enough)
    expect(state.signals[0].targets[1].touched).toBe(false)

    // Publisher score should be increased
    expect(state.signals[0].publisher.score).toBe(101) // Original 100 + 1 for the touched target

    // Restore the original Date.now
    Date.now = originalDate
  })

  test("should handle loading states", () => {
    const loadingAction = {
      type: createSignalAsync.pending.type
    }
    const loadingState = signalsReducer(initialState, loadingAction)
    expect(loadingState.loading).toBe(true)

    const errorAction = {
      type: createSignalAsync.rejected.type,
      error: { message: "Failed to create signal" }
    }
    const errorState = signalsReducer(loadingState, errorAction)
    expect(errorState.loading).toBe(false)
    expect(errorState.error).toBe("Failed to create signal")
  })
})
