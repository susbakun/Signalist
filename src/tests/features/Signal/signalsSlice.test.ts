import signalsReducer, {
  createSignal,
  dislikeSignal,
  likeSignal,
  updateSignalsState
} from "@/features/Signal/signalsSlice"
import { SignalModel } from "@/shared/models"
import { CoinType, SimplifiedAccountType } from "@/shared/types"
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

  const initialState: SignalModel[] = [
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
      status: "not_opened",
      date: Date.now() - 3600000, // 1 hour ago
      likes: [],
      description: "Test signal",
      isPremium: false,
      publisher: mockPublisher
    }
  ]

  test("should handle initial state", () => {
    expect(signalsReducer(undefined, { type: "unknown" })).toEqual(expect.any(Array))
  })

  test("should handle createSignal", () => {
    const newSignal = {
      openTime: Date.now() + 3600000,
      closeTime: Date.now() + 86400000,
      publisher: mockPublisher,
      status: "not_opened",
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

    const action = createSignal(newSignal)
    const state = signalsReducer(initialState, action)

    expect(state.length).toBe(2)
    expect(state[1]).toEqual({
      id: "mocked-uuid",
      date: expect.any(Number),
      likes: [],
      ...newSignal
    })
  })

  test("should handle createSignal with chart image", () => {
    const newSignal = {
      openTime: Date.now() + 3600000,
      closeTime: Date.now() + 86400000,
      publisher: mockPublisher,
      status: "not_opened",
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
      chartImageId: "chart-123"
    }

    const action = createSignal(newSignal)
    const state = signalsReducer(initialState, action)

    expect(state.length).toBe(2)
    expect(state[1].chartImageId).toBe("chart-123")
  })

  test("should handle likeSignal", () => {
    const action = likeSignal({ signalId: "1", user: mockUser })
    const state = signalsReducer(initialState, action)

    expect(state[0].likes).toContainEqual(mockUser)
    expect(state[0].likes.length).toBe(1)
  })

  test("should not add duplicate likes", () => {
    // First like
    let state = signalsReducer(initialState, likeSignal({ signalId: "1", user: mockUser }))

    // Try to like again with same user
    state = signalsReducer(state, likeSignal({ signalId: "1", user: mockUser }))

    // Should still only have one like
    expect(state[0].likes.length).toBe(1)
  })

  test("should handle dislikeSignal", () => {
    // First add a like
    let state = signalsReducer(initialState, likeSignal({ signalId: "1", user: mockUser }))

    // Then remove it
    const action = dislikeSignal({ signalId: "1", user: mockUser })
    state = signalsReducer(state, action)

    expect(state[0].likes).not.toContainEqual(mockUser)
    expect(state[0].likes.length).toBe(0)
  })

  test("should handle updateSignalsState for not_opened signals", () => {
    // Mock the current time to be after the openTime
    const mockCurrentTime = initialState[0].openTime + 1000
    const originalDate = Date.now
    Date.now = vi.fn().mockReturnValue(mockCurrentTime)

    const mockCoins: CoinType[] = [
      {
        uuid: "bitcoin-uuid",
        rank: 1,
        symbol: "BTC",
        change: "2.5",
        marketCap: "1000000000",
        price: "51000",
        iconUrl: "btc-icon.png",
        name: "Bitcoin",
        "24hVolume": "50000000"
      }
    ]

    const action = updateSignalsState({ coins: mockCoins })
    const state = signalsReducer(initialState, action)

    // Signal should now be open
    expect(state[0].status).toBe("open")

    // Restore the original Date.now
    Date.now = originalDate
  })

  test("should handle updateSignalsState for open signals", () => {
    // Create a signal that's already open
    const openSignal = {
      ...initialState[0],
      status: "open",
      openTime: Date.now() - 3600000, // 1 hour ago
      closeTime: Date.now() + 1000 // Just about to close
    }

    // Mock the current time to be after the closeTime
    const mockCurrentTime = openSignal.closeTime + 1000
    const originalDate = Date.now
    Date.now = vi.fn().mockReturnValue(mockCurrentTime)

    // Mock the current price to be above the first target
    const mockCoins: CoinType[] = [
      {
        uuid: "bitcoin-uuid",
        rank: 1,
        symbol: "BTC",
        change: "2.5",
        marketCap: "1000000000",
        price: "53000", // Above the first target
        iconUrl: "btc-icon.png",
        name: "Bitcoin",
        "24hVolume": "50000000"
      }
    ]

    const action = updateSignalsState({ coins: mockCoins })
    const state = signalsReducer([{ ...openSignal, status: "open" as const }], action)

    // Signal should now be closed
    expect(state[0].status).toBe("closed")

    // First target should be marked as touched
    expect(state[0].targets[0].touched).toBe(true)

    // Second target should not be touched (price not high enough)
    expect(state[0].targets[1].touched).toBe(false)

    // Publisher score should be increased
    expect(state[0].publisher.score).toBe(101) // Original 100 + 1 for the touched target

    // Restore the original Date.now
    Date.now = originalDate
  })

  test("should handle updateSignalsState for open signals with all targets touched", () => {
    // Create a signal that's already open
    const openSignal = {
      ...initialState[0],
      status: "open",
      openTime: Date.now() - 3600000, // 1 hour ago
      closeTime: Date.now() + 1000 // Just about to close
    }

    // Mock the current time to be after the closeTime
    const mockCurrentTime = openSignal.closeTime + 1000
    const originalDate = Date.now
    Date.now = vi.fn().mockReturnValue(mockCurrentTime)

    // Mock the current price to be above all targets
    const mockCoins: CoinType[] = [
      {
        uuid: "bitcoin-uuid",
        rank: 1,
        symbol: "BTC",
        change: "2.5",
        marketCap: "1000000000",
        price: "56000", // Above both targets
        iconUrl: "btc-icon.png",
        name: "Bitcoin",
        "24hVolume": "50000000"
      }
    ]

    const action = updateSignalsState({ coins: mockCoins })
    const state = signalsReducer([{ ...openSignal, status: "open" as const }], action)

    // Signal should now be closed
    expect(state[0].status).toBe("closed")

    // Both targets should be marked as touched
    expect(state[0].targets[0].touched).toBe(true)
    expect(state[0].targets[1].touched).toBe(true)

    // Publisher score should be increased by 2
    expect(state[0].publisher.score).toBe(102) // Original 100 + 2 for the touched targets

    // Restore the original Date.now
    Date.now = originalDate
  })

  test("should not update signal status if time conditions are not met", () => {
    // Create a signal that's not opened yet
    const notOpenedSignal = {
      ...initialState[0],
      status: "not_opened",
      openTime: Date.now() + 3600000, // 1 hour in the future
      closeTime: Date.now() + 86400000 // 24 hours in the future
    }

    // Mock the current time to be before the openTime
    const mockCurrentTime = notOpenedSignal.openTime - 3600000 // 1 hour before open time
    const originalDate = Date.now
    Date.now = vi.fn().mockReturnValue(mockCurrentTime)

    const mockCoins: CoinType[] = [
      {
        uuid: "bitcoin-uuid",
        rank: 1,
        symbol: "BTC",
        change: "2.5",
        marketCap: "1000000000",
        price: "51000",
        iconUrl: "btc-icon.png",
        name: "Bitcoin",
        "24hVolume": "50000000"
      }
    ]

    const action = updateSignalsState({ coins: mockCoins })
    const state = signalsReducer([{ ...notOpenedSignal, status: "not_opened" as const }], action)

    // Signal should still be not_opened
    expect(state[0].status).toBe("not_opened")

    // Restore the original Date.now
    Date.now = originalDate
  })

  test("should handle updateSignalsState with no matching coin", () => {
    // Create a signal that's open
    const openSignal = {
      ...initialState[0],
      status: "open",
      openTime: Date.now() - 3600000, // 1 hour ago
      closeTime: Date.now() + 1000 // Just about to close
    }

    // Mock the current time to be after the closeTime
    const mockCurrentTime = openSignal.closeTime + 1000
    const originalDate = Date.now
    Date.now = vi.fn().mockReturnValue(mockCurrentTime)

    // Mock coins with no matching coin for the signal
    const mockCoins: CoinType[] = [
      {
        uuid: "ethereum-uuid", // Different coin
        rank: 2,
        symbol: "ETH",
        change: "3.5",
        marketCap: "500000000",
        price: "3500",
        iconUrl: "eth-icon.png",
        name: "Ethereum",
        "24hVolume": "30000000"
      }
    ]

    const action = updateSignalsState({ coins: mockCoins })
    const state = signalsReducer([{ ...openSignal, status: "open" as const }], action)

    // Signal should be closed due to time, but targets should not be touched
    expect(state[0].status).toBe("closed")
    expect(state[0].targets[0].touched).toBe(false)
    expect(state[0].targets[1].touched).toBe(false)
    expect(state[0].publisher.score).toBe(100) // Score unchanged

    // Restore the original Date.now
    Date.now = originalDate
  })
})
