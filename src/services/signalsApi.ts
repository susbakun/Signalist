import { backendUrl } from "@/shared/constants"
import { SignalModel } from "@/shared/models"
import { SignalAccountType, SimplifiedAccountType } from "@/shared/types"

const SIGNALS_ENDPOINT = `${backendUrl}/signals`

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Something went wrong")
  }
  return response.json()
}

// Get all signals
export const fetchSignals = async (
  page = 1,
  limit = 10
): Promise<{
  data: SignalModel[]
  totalCount: number
  hasMore: boolean
}> => {
  const response = await fetch(`${SIGNALS_ENDPOINT}?page=${page}&limit=${limit}`)
  const data = await handleResponse(response)
  return {
    data: data.data,
    totalCount: data.totalCount || data.data.length,
    hasMore: data.hasMore || data.data.length >= limit
  }
}

// Get a single signal by ID
export const fetchSignalById = async (id: string): Promise<SignalModel> => {
  const response = await fetch(`${SIGNALS_ENDPOINT}/${id}`)
  const data = await handleResponse(response)
  return data.data
}

// Create a new signal
export const createSignal = async (signalData: {
  market: SignalModel["market"]
  entry: number
  stoploss: number
  targets: SignalModel["targets"]
  openTime: number
  closeTime: number
  status: SignalModel["status"]
  isPremium: boolean
  description?: string
  chartImageId?: string
  publisher: SignalAccountType
}): Promise<SignalModel> => {
  const response = await fetch(SIGNALS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(signalData)
  })
  const data = await handleResponse(response)
  return data.data
}

// Update signal status
export const updateSignalStatus = async (signalId: string): Promise<SignalModel> => {
  const response = await fetch(`${SIGNALS_ENDPOINT}/${signalId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    }
  })
  const data = await handleResponse(response)
  return data.data
}

// Like a signal
export const likeSignal = async (
  signalId: string,
  user: SimplifiedAccountType
): Promise<SignalModel> => {
  const response = await fetch(`${SIGNALS_ENDPOINT}/${signalId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ user })
  })
  const data = await handleResponse(response)
  return data.data
}

// Dislike a signal
export const dislikeSignal = async (
  signalId: string,
  user: SimplifiedAccountType
): Promise<SignalModel> => {
  const response = await fetch(`${SIGNALS_ENDPOINT}/${signalId}/dislike`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ user })
  })
  const data = await handleResponse(response)
  return data.data
}

// Delete a signal
export const removeSignal = async (id: string): Promise<void> => {
  const response = await fetch(`${SIGNALS_ENDPOINT}/${id}`, {
    method: "DELETE"
  })
  await handleResponse(response)
}
