import postsReducer from '@/features/Post/postsSlice'
import { cryptoApi } from '@/services/cryptoApi'
import { cryptoNewsApi } from '@/services/cryptoNewsApi'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    [cryptoApi.reducerPath]: cryptoApi.reducer,
    [cryptoNewsApi.reducerPath]: cryptoNewsApi.reducer,
    posts: postsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cryptoApi.middleware).concat(cryptoNewsApi.middleware)
})

export default store
