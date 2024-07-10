import { isDevmode } from "@/utils"

export const demoImageUrl = "https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News"
export const messagesRouteRegExp = /\/messages\/?/
export const editPostRouteRegExp = /\/(explore\/)?(suggests|posts)\/editPost\/.*/
export const tradingviewSupportHost = "https://www.tradingview.com"
export const nobitexMarketChart = "https://nobitex.ir/nobitex-cdn/charts/"
export const appwriteEndpoint = "https://cloud.appwrite.io/v1"

export const appwriteProjectId = isDevmode()
  ? import.meta.env.VITE_APPWRITE_PROJECT_ID
  : process.env.VITE_APPWRITE_PROJECT_ID

export const appwritePostsBucketId = isDevmode()
  ? import.meta.env.VITE_APPWRITE_POSTS_BUCKET_ID
  : process.env.VITE_APPWRITE_POSTS_BUCKET_ID

export const appwriteSignalsBucketId = isDevmode()
  ? import.meta.env.VITE_APPWRITE_SIGNALS_BUCKET_ID
  : process.env.VITE_APPWRITE_SIGNALS_BUCKET_ID

export const appwriteMessagesBucketId = isDevmode()
  ? import.meta.env.VITE_APPWRITE_MESSAGES_BUCKET_ID
  : process.env.VITE_APPWRITE_MESSAGES_BUCKET_ID
