import { newsApiKey } from "@/shared/constants"
import { NewsApiResponse } from "@/shared/models"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

type NewsQueryInput = {
  category?: string
  source?: string
  page?: number
  pageSize?: number
}

const baseUrl = "https://newsapi.org/v2"

const createRequest = (url: string) => ({
  url: `${url}&apiKey=${newsApiKey}`
})

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getNews: builder.query<NewsApiResponse, NewsQueryInput>({
      query: ({ category, source, page = 1, pageSize = 10 }) => {
        const params = new URLSearchParams()

        // Always include pagination and language params
        params.append("page", page.toString())
        params.append("pageSize", pageSize.toString())
        params.append("language", "en")

        // If source is provided, use it as a domain filter
        if (source) {
          params.append("domains", `${source}.com`)
        }

        // Always include category in search query
        params.append("q", category || "cryptocurrency")
        params.append("sortBy", "publishedAt")

        return createRequest(`${baseUrl}/everything?${params.toString()}`)
      }
    })
  })
})

export const { useGetNewsQuery } = newsApi
