import { MessageRooms } from "@/components"
import { AppDispatch } from "@/app/store"
import { fetchUserConversations, useAppSelector } from "@/features/Message/messagesSlice"
import { getCurrentUsername } from "@/utils"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Outlet, useParams } from "react-router-dom"

export const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState<null | string>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  const dispatch = useDispatch<AppDispatch>()
  const currentUsername = getCurrentUsername()

  // Get the conversations from the updated messagesSlice structure
  const { conversations, error } = useAppSelector((state) => state.messages)
  const myMessages = conversations[currentUsername] || {}

  const { id } = useParams()

  // Fetch conversations when component mounts
  useEffect(() => {
    const fetchConversations = async () => {
      if (currentUsername) {
        try {
          // Clear any loading state
          setInitialLoading(true)

          // Fetch the user conversations from the backend
          const result = await dispatch(fetchUserConversations(currentUsername))

          // Check if we got any data
          if (
            fetchUserConversations.fulfilled.match(result) &&
            Object.keys(result.payload || {}).length === 0
          ) {
            console.log("No conversations found for user")
          }
        } catch (error) {
          console.error("Failed to fetch conversations:", error)
        } finally {
          setInitialLoading(false)
        }
      } else {
        setInitialLoading(false)
      }
    }

    // Fetch conversations immediately on page load
    fetchConversations()

    // And set up an interval to refresh conversations every 30 seconds
    const intervalId = setInterval(fetchConversations, 30000)

    // Clean up on unmount
    return () => {
      clearInterval(intervalId)
    }
  }, [dispatch, currentUsername])

  useEffect(() => {
    if (id) {
      setSelectedChat(id)
    }
  }, [id])

  // Only show loading on initial load, not during updates or message sending
  const isLoading = initialLoading && Object.keys(myMessages).length === 0

  return (
    <div className="flex h-screen bg-primary-main dark:bg-[#101827] text-gray-600 dark:text-gray-100">
      <div
        className={`${selectedChat ? "hidden md:block" : "block"} md:w-[35%] lg:w-[30%] xl:w-[25%] w-full h-full overflow-y-auto border-r border-gray-200 dark:border-gray-700`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Loading conversations...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-400">Error: {error}</p>
          </div>
        ) : (
          <MessageRooms myMessages={myMessages} />
        )}
      </div>
      <div
        className={`bg-gray-100 dark:bg-gray-900 flex flex-col ${selectedChat ? "block" : "hidden"} md:block md:w-[65%] lg:w-[70%] xl:w-[75%] w-full max-h-full overflow-y-hidden`}
      >
        {selectedChat && myMessages[selectedChat] ? (
          <Outlet
            context={{
              myMessages: myMessages[selectedChat],
              onBack: () => setSelectedChat(null)
            }}
          />
        ) : (
          <div className="hidden md:flex items-center justify-center h-full">
            <p className="text-gray-400">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}
