import { WallexCryptoResponseType } from "@/shared/models"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const baseUrl = "https://api.wallex.ir"

// New Wallex API
export const wallexApi = createApi({
  reducerPath: "wallexApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getWallexMarkets: builder.query<WallexCryptoResponseType, void>({
      query: () => "/v1/markets"
    })
  })
})

export const { useGetWallexMarketsQuery } = wallexApi
