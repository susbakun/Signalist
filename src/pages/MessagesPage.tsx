import { MessageRooms } from "@/components"
import { AppDispatch } from "@/app/store"
import { fetchUserConversations, useAppSelector } from "@/features/Message/messagesSlice"
import { getCurrentUsername } from "@/utils"
import { useEffect, useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { Outlet, useParams } from "react-router-dom"
import io from "socket.io-client"
import { Socket } from "socket.io-client"

export const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState<null | string>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const socketRef = useRef<Socket | null>(null)

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

    // And set up an interval to refresh conversations more frequently
    // This helps catch up on missed messages due to socket issues
    const intervalId = setInterval(fetchConversations, 15000) // 15 seconds instead of 30

    // Clean up on unmount
    return () => {
      clearInterval(intervalId)
    }
  }, [dispatch, currentUsername])

  // Setup socket connection for real-time updates
  useEffect(() => {
    if (!currentUsername) return

    // Get backend URL from environment or use default
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://signalist-backend.liara.run"
    let socketUrl = backendUrl
    if (socketUrl.endsWith("/api")) {
      socketUrl = socketUrl.replace(/\/api$/, "")
    }

    console.log(`Connecting to main socket at: ${socketUrl}`)

    // Create socket connection
    const newSocket = io(socketUrl, {
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"]
    })

    // Socket connection events
    newSocket.on("connect", () => {
      console.log("Main socket connected with ID:", newSocket.id)

      // Authenticate with username
      newSocket.emit("authenticate", currentUsername)
    })

    newSocket.on("connect_error", (error) => {
      console.error("Main socket connection error:", error)
    })

    newSocket.on("disconnect", (reason) => {
      console.log("Main socket disconnected:", reason)
    })

    // Try to connect
    newSocket.connect()

    // Handle new messages at the page level
    newSocket.on("newMessage", () => {
      // Refresh conversations when any new message arrives
      dispatch(fetchUserConversations(currentUsername))
    })

    socketRef.current = newSocket

    // Cleanup on unmount
    return () => {
      newSocket.disconnect()
      socketRef.current = null
    }
  }, [currentUsername, dispatch])

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
