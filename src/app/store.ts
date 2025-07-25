import messagesReducer from "@/features/Message/messagesSlice"
import postsReducer from "@/features/Post/postsSlice"
import signalsReducer from "@/features/Signal/signalsSlice"
import usersReducer from "@/features/User/usersSlice"
import { wallexApi } from "@/services/cryptoApi"
import { newsApi } from "@/services/newsApi"
import { configureStore } from "@reduxjs/toolkit"
import { thunk } from "redux-thunk"

const store = configureStore({
  reducer: {
    [wallexApi.reducerPath]: wallexApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    posts: postsReducer,
    users: usersReducer,
    signals: signalsReducer,
    messages: messagesReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wallexApi.middleware).concat(newsApi.middleware).concat(thunk)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
