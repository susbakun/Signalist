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
  limit = 10,
  options?: {
    publishers?: string[]
    publisher?: string
    market?: string
    status?: "open" | "closed" | "not_opened" | ""
    openFrom?: number | null
    openTo?: number | null
    closeFrom?: number | null
    closeTo?: number | null
  }
): Promise<{
  data: SignalModel[]
  totalCount: number
  hasMore: boolean
}> => {
  const url = new URL(SIGNALS_ENDPOINT)
  url.searchParams.set("page", String(page))
  url.searchParams.set("limit", String(limit))
  if (options?.publisher) url.searchParams.set("publisher", options.publisher)
  if (options?.publishers && options.publishers.length)
    url.searchParams.set("publishers", options.publishers.join(","))
  if (options?.market) url.searchParams.set("market", options.market)
  if (options?.status) url.searchParams.set("status", options.status)
  if (options?.openFrom != null) url.searchParams.set("openFrom", String(options.openFrom))
  if (options?.openTo != null) url.searchParams.set("openTo", String(options.openTo))
  if (options?.closeFrom != null) url.searchParams.set("closeFrom", String(options.closeFrom))
  if (options?.closeTo != null) url.searchParams.set("closeTo", String(options.closeTo))

  const response = await fetch(url.toString(), {
    credentials: "include"
  })
  const data = await handleResponse(response)
  return {
    data: data.data,
    totalCount: data.totalCount || data.data.length,
    hasMore: data.hasMore || data.data.length >= limit
  }
}

// Fetch many signals (paginated) and return a concatenated list
export const fetchManySignals = async (
  maxPages = 10,
  limit = 50,
  params?: { publisher?: string }
): Promise<SignalModel[]> => {
  const all: SignalModel[] = []
  for (let page = 1; page <= maxPages; page++) {
    const url = new URL(`${SIGNALS_ENDPOINT}`)
    url.searchParams.set("page", String(page))
    url.searchParams.set("limit", String(limit))
    if (params?.publisher) url.searchParams.set("publisher", params.publisher)
    const response = await fetch(url.toString(), { credentials: "include" })
    const res = await handleResponse(response)
    const data: SignalModel[] = res.data
    const hasMore: boolean = res.hasMore || data.length >= limit
    all.push(...data)
    if (!hasMore) break
  }
  return all
}

// Fetch signals for a specific publisher username
export const fetchUserSignals = async (
  username: string,
  options?: { maxPages?: number; limit?: number }
): Promise<Pick<SignalModel, "date" | "score">[]> => {
  const maxPages = options?.maxPages ?? 10
  const limit = options?.limit ?? 50
  const all = await fetchManySignals(maxPages, limit, { publisher: username })
  return all.map((s) => ({ date: s.date, score: s.score ?? 0 }))
}

// Get a single signal by ID
export const fetchSignalById = async (id: string): Promise<SignalModel> => {
  const response = await fetch(`${SIGNALS_ENDPOINT}/${id}`, {
    credentials: "include"
  })
  const data = await handleResponse(response)
  return data.data
}

// Get top signals for last N ms (default 7 days)
export const fetchTopSignals = async (
  limit = 3,
  sinceMs = 7 * 24 * 60 * 60 * 1000
): Promise<SignalModel[]> => {
  const url = new URL(`${SIGNALS_ENDPOINT}/top`)
  url.searchParams.set("limit", String(limit))
  url.searchParams.set("since", String(Date.now() - sinceMs))
  const response = await fetch(url.toString(), { credentials: "include" })
  const data = await handleResponse(response)
  return data.data as SignalModel[]
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
    credentials: "include",
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
    },
    credentials: "include"
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
    credentials: "include",
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
    credentials: "include",
    body: JSON.stringify({ user })
  })
  const data = await handleResponse(response)
  return data.data
}

// Delete a signal
export const removeSignal = async (id: string): Promise<void> => {
  const response = await fetch(`${SIGNALS_ENDPOINT}/${id}`, {
    method: "DELETE",
    credentials: "include"
  })
  await handleResponse(response)
}

// Edit a signal (update description, closeTime, and status)
export const updateSignal = async (
  signalId: string,
  updateData: {
    description: string
    closeTime: number
    status?: SignalModel["status"]
  }
): Promise<SignalModel> => {
  const response = await fetch(`${SIGNALS_ENDPOINT}/${signalId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(updateData)
  })
  const data = await handleResponse(response)
  return data.data
}

// Upload image for signal
export const uploadSignalImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${backendUrl}/upload/signals`, {
    method: "POST",
    credentials: "include",
    body: formData
  })

  if (!response.ok) {
    throw new Error("Failed to upload image")
  }

  const data = await response.json()
  return data.url
}
