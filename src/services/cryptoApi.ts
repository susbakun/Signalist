import { WallexCryptoResponseType } from "@/shared/models"
import { backendUrl } from "@/shared/constants"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Updated to use backend API instead of direct Wallex API calls
export const wallexApi = createApi({
  reducerPath: "wallexApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: backendUrl,
    credentials: "include"
  }),
  endpoints: (builder) => ({
    getWallexMarkets: builder.query<{ success: boolean; data: WallexCryptoResponseType }, void>({
      query: () => "/crypto/wallex/markets",
      transformResponse: (response: { success: boolean; data: WallexCryptoResponseType }) => response
    })
  })
})

export const { useGetWallexMarketsQuery } = wallexApi
