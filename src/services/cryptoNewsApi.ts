import { CryptoNewsType } from "@/shared/models"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const apiKey = import.meta.env.VITE_X_API_KEY

type NewsQueryInput = {
  newsCategory: string
  page: number
  count: number
}

const baseUrl = "https://newsapi.org/v2/"

export const cryptoNewsApi = createApi({
  reducerPath: "cryptoNewsApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query<CryptoNewsType, NewsQueryInput>({
      query: ({ newsCategory, count, page }) =>
        `everything?q=${newsCategory}&pageSize=${count}&page=${page}&sortBy=publishedAt&apiKey=${apiKey}`
    })
  })
})

export const { useGetCryptoNewsQuery } = cryptoNewsApi
