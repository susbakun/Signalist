import { CryptoNewsType } from "@/shared/models";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const cryptoNewsHeaders = {
  authorization: `Apikey ${import.meta.env.VITE_CRYPTO_NEWS_API}`,
};

type NewsQueryInput = {
  newsCategory?: string;
  page?: number;
  feeds?: string
};

const baseUrl = "https://min-api.cryptocompare.com/data/v2/";

const createRequest = (url: string) => ({ url, headers: cryptoNewsHeaders });

export const cryptoNewsApi = createApi({
  reducerPath: "cryptoNewsApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query<CryptoNewsType, NewsQueryInput>({
      query: ({ newsCategory, feeds = "cointelegraph", page = 1, }) => {
        const params = new URLSearchParams();
        if (newsCategory) params.append("categories", newsCategory);
        params.append("page", page.toString());
        params.append("feeds", feeds);
        params.append("sortOrder", "latest"); // Optional sorting parameter.

        return createRequest(`news/?${params.toString()}`);
      },
    }),
  }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;
