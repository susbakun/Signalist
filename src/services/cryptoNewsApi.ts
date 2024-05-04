import { CryptoNewsType } from '@/shared/models'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const cryptoNewsHeaders = {
  'X-Api-Key': import.meta.env.VITE_X_API_KEY
}

type NewsQueryInput = {
  newsCategory: string
  page: number
  count: number
}

const baseUrl = 'https://newsapi.org/v2/'

const createRequest = (url: string) => ({ url, headers: cryptoNewsHeaders })

export const cryptoNewsApi = createApi({
  reducerPath: 'cryptoNewsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query<CryptoNewsType, NewsQueryInput>({
      query: ({ newsCategory, count, page }) =>
        createRequest(
          `everything?q=${newsCategory}&pageSize=${count}&page=${page}&sortBy=publishedAt`
        )
    })
  })
})

export const { useGetCryptoNewsQuery } = cryptoNewsApi
