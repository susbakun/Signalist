import {
  CoinHistoryResponseType,
  CryptoDetailsResponseType,
  CryptoResponseType
} from "@/shared/models"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const cryptoApiHeaders = {
  "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_CRYPTOS_KEY,
  "X-RapidAPI-Host": import.meta.env.VITE_RAPIDAPI_CRYPTOS_HOST
}

const baseUrl = "https://coinranking1.p.rapidapi.com"

const createRequest = (url: string) => ({ url, headers: cryptoApiHeaders })

export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
  // refetchOnFocus: true,
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptos: builder.query<CryptoResponseType, number>({
      query: (count: number) => createRequest(`/coins?limit=${count}`)
    }),
    getCryptoDetails: builder.query<CryptoDetailsResponseType, string>({
      query: (coinId) => createRequest(`/coin/${coinId}`)
    }),
    getCryptoHistory: builder.query<
      CoinHistoryResponseType,
      { coinId: string; timePeriod: string }
    >({
      query: ({ coinId, timePeriod }) =>
        createRequest(`/coin/${coinId}/history?timePeriod=${timePeriod}`)
    })
  })
})

export const { useGetCryptosQuery, useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } = cryptoApi
