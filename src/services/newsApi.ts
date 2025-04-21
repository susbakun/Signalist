import { backendUrl } from "@/shared/constants"
import { NewsItem, CryptoCurrency } from "@/shared/models"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

type NewsQueryInput = {
  currency?: string
  page?: number
  filter?: "rising" | "hot" | "bullish" | "bearish" | ""
  source?: string
  category?: string
  pageSize?: number
}

// Define the expected output format that matches what DetailedNewsPage expects
interface NewsApiResponse {
  articles: Array<{
    title: string
    url: string
    urlToImage?: string
    description?: string
    publishedAt: string
    source: {
      name: string
    }
    currencies?: CryptoCurrency[] | null
  }>
  totalResults?: number
  error?: {
    message: string
    status?: number
  }
}

// Define the structure of the CryptoPanic response
interface CryptoPanicResponseData {
  success?: boolean
  message?: string
  status?: number
  count?: number
  results?: NewsItem[]
  error?: string
  next?: string | null
  previous?: string | null
}

// Transform CryptoPanic response to the format expected by components
const transformCryptoPanicResponse = (response: CryptoPanicResponseData): NewsApiResponse => {
  // Check if there was an error response
  if (response.success === false) {
    console.error("API Error:", response)
    return {
      articles: [],
      totalResults: 0,
      error: {
        message: response.message || "An error occurred",
        status: response.status
      }
    }
  }

  // If there's no results array, return empty data
  if (!response.results || !Array.isArray(response.results)) {
    console.warn("Unexpected API response format:", response)
    return {
      articles: [],
      totalResults: 0
    }
  }

  // Normal processing for valid response
  return {
    articles: response.results.map((item: NewsItem) => ({
      title: item.title || "No Title",
      url: item.url || "#",
      urlToImage: item.image_url,
      description: item.title, // CryptoPanic doesn't provide description
      publishedAt: item.published_at || new Date().toISOString(),
      source: {
        name: item.source?.title || "Unknown Source"
      },
      // Pass currencies for display in the UI
      currencies: item.currencies
    })),
    totalResults: response.count || response.results.length
  }
}

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    // Add more descriptive error handling
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json")
      return headers
    }
  }),
  endpoints: (builder) => ({
    getNews: builder.query<NewsApiResponse, NewsQueryInput>({
      query: (args) => {
        // Build query parameters
        const queryParams = new URLSearchParams()

        if (args.filter) {
          queryParams.append("filter", args.filter)
        }

        if (args.currency) {
          queryParams.append("currencies", args.currency)
        }

        if (args.page && args.page > 1) {
          queryParams.append("page", args.page.toString())
        }

        // Return the endpoint with query parameters
        return {
          url: `/news?${queryParams.toString()}`,
          method: "GET"
        }
      },
      transformResponse: (response: CryptoPanicResponseData) =>
        transformCryptoPanicResponse(response),
      // Properly transform errors
      transformErrorResponse: (response: { status: number; data: CryptoPanicResponseData }) => {
        console.error("API Error Response:", response)
        return {
          articles: [],
          totalResults: 0,
          error: {
            message: response.data?.message || "Error fetching news",
            status: response.status
          }
        }
      }
    })
  })
})

export const { useGetNewsQuery } = newsApi
