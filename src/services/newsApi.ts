import { backendUrl } from "@/shared/constants"
import { CryptoCurrency } from "@/shared/models"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

type NewsQueryInput = {
  currency?: string
  page?: number
  source_ids?: string
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

// Define the structure of the CoinDesk response (after backend transformation)
interface CoinDeskResponseData {
  success?: boolean
  message?: string
  status?: number
  count?: number
  results?: Array<{
    title: string
    url: string
    image_url?: string
    description?: string
    published_at: string
    source: {
      title: string
    }
    currencies?: Array<{
      code: string
      title: string
    }>
    body?: string
  }>
  error?: string
  next?: string | null
  previous?: string | null
}

// Transform CoinDesk response to the format expected by components
const transformCoinDeskResponse = (response: CoinDeskResponseData): NewsApiResponse => {
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
    articles: response.results.map((item) => ({
      title: item.title || "No Title",
      url: item.url || "#",
      urlToImage: item.image_url,
      description: item.description || item.title, // Use description or fallback to title
      publishedAt: item.published_at || new Date().toISOString(),
      source: {
        name: item.source?.title || "CoinDesk"
      },
      // Convert currencies to match expected format
      currencies:
        item.currencies?.map((currency) => ({
          code: currency.code,
          title: currency.title,
          slug: currency.code.toLowerCase(),
          url: `#${currency.code.toLowerCase()}` // Generate a placeholder URL
        })) || null
    })),
    totalResults: response.count || response.results.length
  }
}

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    credentials: "include",
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

        if (args.source_ids) {
          queryParams.append("source_ids", args.source_ids)
        }

        if (args.category) {
          queryParams.append("categories", args.category)
        }

        if (args.page && args.page > 1) {
          queryParams.append("page", args.page.toString())
        }

        if (args.pageSize) {
          queryParams.append("pageSize", args.pageSize.toString())
        }

        // Return the endpoint with query parameters
        return {
          url: `/news?${queryParams.toString()}`,
          method: "GET"
        }
      },
      transformResponse: (response: CoinDeskResponseData) => transformCoinDeskResponse(response),
      // Properly transform errors
      transformErrorResponse: (response: { status: number; data: CoinDeskResponseData }) => {
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
