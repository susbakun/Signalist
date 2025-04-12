import signalsReducer, {
  createSignalAsync,
  dislikeSignalAsync,
  fetchSignals,
  likeSignalAsync,
  updateSignalStatusAsync,
  updatePage
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
    error: null,
    page: 1,
    hasMore: true,
    totalCount: 1
  }

  test("should handle initial state", () => {
    expect(signalsReducer(undefined, { type: "unknown" })).toEqual({
      signals: [],
      loading: false,
      error: null,
      page: 1,
      hasMore: true,
      totalCount: 0
    })
  })

  test("should handle fetchSignals.fulfilled", () => {
    const newSignals = [
      {
        id: "2",
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
        openTime: Date.now() + 3600000,
        closeTime: Date.now() + 86400000,
        status: "not_opened" as StatusType,
        date: Date.now() - 1800000,
        likes: [],
        description: "Ethereum signal",
        isPremium: false,
        publisher: mockPublisher
      }
    ]

    // Test first page (reset)
    const resetAction = {
      type: fetchSignals.fulfilled.type,
      payload: {
        data: newSignals,
        isReset: true,
        totalCount: 1,
        hasMore: false
      }
    }

    let state = signalsReducer(initialState, resetAction)
    expect(state.signals).toEqual(newSignals)
    expect(state.loading).toBe(false)
    expect(state.page).toBe(1)
    expect(state.hasMore).toBe(false)
    expect(state.totalCount).toBe(1)

    // Test pagination
    const paginationAction = {
      type: fetchSignals.fulfilled.type,
      payload: {
        data: newSignals,
        isReset: false,
        totalCount: 2,
        hasMore: true
      }
    }

    state = signalsReducer(initialState, paginationAction)
    expect(state.signals.length).toBe(2)
    expect(state.loading).toBe(false)
    expect(state.hasMore).toBe(true)
    expect(state.totalCount).toBe(2)
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
        openTime: expect.any(Number),
        closeTime: expect.any(Number),
        status: "not_opened" as StatusType,
        date: expect.any(Number),
        likes: [mockUser],
        description: "Test signal",
        isPremium: false,
        publisher: mockPublisher
      }
    }
    const state = signalsReducer(initialState, action)

    expect(state.signals[0].likes).toContainEqual(mockUser)
    expect(state.signals[0].likes.length).toBe(1)
  })

  test("should handle dislikeSignalAsync.fulfilled", () => {
    // First add a like
    const initialStateWithLike = {
      ...initialState,
      signals: [
        {
          ...initialState.signals[0],
          likes: [mockUser]
        }
      ]
    }

    const action = {
      type: dislikeSignalAsync.fulfilled.type,
      payload: {
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
        openTime: expect.any(Number),
        closeTime: expect.any(Number),
        status: "not_opened" as StatusType,
        date: expect.any(Number),
        likes: [],
        description: "Test signal",
        isPremium: false,
        publisher: mockPublisher
      }
    }
    const state = signalsReducer(initialStateWithLike, action)

    expect(state.signals[0].likes).not.toContainEqual(mockUser)
    expect(state.signals[0].likes.length).toBe(0)
  })

  test("should handle updateSignalStatusAsync.fulfilled", () => {
    const action = {
      type: updateSignalStatusAsync.fulfilled.type,
      payload: {
        id: "1",
        market: {
          name: "BTC/USD",
          uuid: "bitcoin-uuid"
        },
        entry: 50000,
        stoploss: 48000,
        targets: [
          { id: "t1", value: 52000, touched: true },
          { id: "t2", value: 55000, touched: false }
        ],
        openTime: expect.any(Number),
        closeTime: expect.any(Number),
        status: "closed" as StatusType,
        date: expect.any(Number),
        likes: [],
        description: "Test signal",
        isPremium: false,
        publisher: {
          ...mockPublisher,
          score: 101
        }
      }
    }
    const state = signalsReducer(initialState, action)

    // Signal should be updated with the new status
    expect(state.signals[0].status).toBe("closed")

    // First target should be marked as touched
    expect(state.signals[0].targets[0].touched).toBe(true)

    // Publisher score should be updated
    expect(state.signals[0].publisher.score).toBe(101)
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

  test("should handle updatePage", () => {
    const action = {
      type: updatePage.type,
      payload: 2
    }
    const state = signalsReducer(initialState, action)

    expect(state.page).toBe(2)
  })
})
