import { SignalModel } from "@/shared/models"
import { CoinType, SignalAccountType, SimplifiedAccountType } from "@/shared/types"

const API_URL = "https://signalist-backend.liara.run/api"

const SIGNALS_ENDPOINT = `${API_URL}/signals`

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Something went wrong")
  }
  return response.json()
}

// Get all signals
export const fetchSignals = async (): Promise<SignalModel[]> => {
  const response = await fetch(SIGNALS_ENDPOINT)
  const data = await handleResponse(response)
  return data.data
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
export const updateSignalStatus = async (
  signalId: string,
  cryptoData: CoinType[]
): Promise<SignalModel> => {
  const response = await fetch(`${SIGNALS_ENDPOINT}/${signalId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ cryptoData })
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
