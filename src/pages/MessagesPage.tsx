import { MessageRooms } from "@/components"
import { AppDispatch } from "@/app/store"
import {
  fetchUserConversations,
  useAppSelector,
  getNewMessage
} from "@/features/Message/messagesSlice"
import { getCurrentUsername, getCurrentUser } from "@/utils"
import { useEffect, useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { Outlet, useParams } from "react-router-dom"
import io, { Socket } from "socket.io-client"
import { socketUrl } from "@/shared/constants"

export const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState<null | string>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  const dispatch = useDispatch<AppDispatch>()
  const currentUsername = getCurrentUsername()
  const currentUser = getCurrentUser()
  const socketRef = useRef<Socket | null>(null)
  const currentRoomRef = useRef<string | null>(null)

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
  }, [dispatch, currentUsername])

  // Initialize socket connection once
  useEffect(() => {
    if (!currentUsername || !currentUser) return

    console.log(`Connecting to socket at: ${socketUrl}`)

    const socket = io(socketUrl, {
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: true, // Force a new connection
      autoConnect: true
    })

    socketRef.current = socket

    socket.on("connect", () => {
      console.log("Socket connected with ID:", socket.id)
      socket.emit("authenticate", currentUsername)

      // If we were in a room before reconnection, rejoin it
      if (currentRoomRef.current) {
        console.log("Rejoining room after reconnection:", currentRoomRef.current)
        socket.emit("joinRoom", currentRoomRef.current)
      }
    })

    socket.on("newMessage", (message) => {
      console.log("Received new message:", message)

      // Only add message if it's from someone else (avoid duplicates)
      if (message.sender.username !== currentUsername) {
        // Find the room ID this message belongs to
        const roomId = currentRoomRef.current
        if (roomId) {
          console.log("Adding message to room:", roomId)
          dispatch(
            getNewMessage({
              currentUser,
              text: message.text,
              messageRoomId: roomId,
              sender: message.sender
            })
          )
        } else {
          console.log("No current room to add message to")
        }
      } else {
        console.log("Ignoring own message")
      }
    })

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
    })

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason)
      if (reason === "io server disconnect") {
        // Server disconnected, try to reconnect
        socket.connect()
      }
    })

    socket.on("reconnect", (attemptNumber) => {
      console.log(`Socket reconnected after ${attemptNumber} attempts`)
    })

    socket.on("reconnect_error", (error) => {
      console.error("Socket reconnection error:", error)
    })

    return () => {
      if (currentRoomRef.current) {
        socket.emit("leaveRoom", currentRoomRef.current)
      }
      socket.disconnect()
    }
  }, [currentUsername, currentUser, dispatch])

  // Handle room joining/leaving when selectedChat changes
  useEffect(() => {
    if (!socketRef.current) return

    // Leave previous room if any
    if (currentRoomRef.current) {
      console.log("Leaving room:", currentRoomRef.current)
      socketRef.current.emit("leaveRoom", currentRoomRef.current)
    }

    // Join new room if selected
    if (id) {
      console.log("Joining room:", id)
      socketRef.current.emit("joinRoom", id)
      currentRoomRef.current = id
      setSelectedChat(id)
    } else {
      currentRoomRef.current = null
      setSelectedChat(null)
    }
  }, [id])

  // Only show loading on initial load, not during updates or message sending
  const isLoading = initialLoading && Object.keys(myMessages).length === 0

  return (
    <div className="flex h-screen bg-primary-main dark:bg-[#101827] text-gray-600 dark:text-gray-100">
      <div
        className={`${selectedChat ? "hidden md:block" : "block"} md:w-[35%] lg:w-[30%] xl:w-[25%] w-full h-full
        overflow-y-auto border-r border-gray-200 dark:border-gray-700`}
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
        className={`bg-gray-100 dark:bg-gray-900 flex flex-col ${selectedChat ? "block" : "hidden"}
           md:block md:w-[65%] lg:w-[70%] xl:w-[75%] w-full max-h-full overflow-y-hidden`}
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
