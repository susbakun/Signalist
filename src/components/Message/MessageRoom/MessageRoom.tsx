import { MessageRoomInput, MessageRoomMessages, MessageRoomTopBar } from "@/components"
import { AppDispatch } from "@/app/store"
import {
  fetchConversationMessages,
  sendMessage,
  sendMessageAsync,
  SendMessagePayload
} from "@/features/Message/messagesSlice"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import * as messagesApi from "@/services/messagesApi"
import { MessageModel } from "@/shared/models"
import { ChatType } from "@/shared/types"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { useOutletContext, useParams } from "react-router-dom"
import { Socket } from "socket.io-client"
import io from "socket.io-client"
import { ToastContainer } from "@/components/Shared/ToastContainer"
import { useToastContainer } from "@/hooks/useToastContainer"

type MessageRoomOutletType = {
  myMessages: MessageModel["username"]["roomId"]
  onBack: () => void
}

export const MessageRoom = () => {
  const [messageText, setMessageText] = useState("")
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined)
  const [isMessageSending, setIsMessageSending] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const processedMessagesRef = useRef<Set<string>>(new Set())
  const pendingMessagesRef = useRef<Set<string>>(new Set())
  const lastSyncTimeRef = useRef<number>(Date.now())
  const locallyAddedMessagesRef = useRef<Record<string, SendMessagePayload>>({})

  const { currentUser: myAccount } = useCurrentUser()

  const { myMessages, onBack } = useOutletContext<MessageRoomOutletType>()
  const dispatch = useDispatch<AppDispatch>()
  const { id: roomId } = useParams()

  const { handleShowToast, showToast, toastContent, toastType } = useToastContainer()

  // Generate a unique, consistent message ID that can be used for deduplication
  const generateMessageId = (sender: string, text: string, timestamp: number): string => {
    return `${timestamp}-${sender}-${text.substring(0, 20)}`.replace(/\s+/g, "-")
  }

  // Update the processed messages set when messages change
  useEffect(() => {
    // When messages update from Redux, update our processed IDs set
    if (myMessages?.messages) {
      const currentIds = new Set(processedMessagesRef.current)
      myMessages.messages.forEach((msg) => {
        if (msg.id) {
          currentIds.add(msg.id)
        } else if (msg.date && msg.sender) {
          // If no ID exists, use date + sender + text as a unique key
          const uniqueKey = generateMessageId(msg.sender.username, msg.text, msg.date)
          currentIds.add(uniqueKey)
        }
      })
      processedMessagesRef.current = currentIds
    }
  }, [myMessages?.messages])

  // Initialize socket connection
  useEffect(() => {
    if (!myAccount?.username) return

    // Store a reference to the Socket instance
    const newSocket = io("https://signalist-backend.liara.run", {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10
    })

    socketRef.current = newSocket

    // Connect and authenticate
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id)
      setSocketConnected(true)
      newSocket.emit("authenticate", myAccount.username)
    })

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected")
      setSocketConnected(false)
    })

    newSocket.on("authenticated", () => {
      console.log("Socket authenticated as", myAccount.username)

      // Sync existing messages to avoid any missed messages
      if (roomId) {
        const lastSync = lastSyncTimeRef.current
        console.log(`Syncing messages since ${new Date(lastSync).toISOString()}`)

        // Get existing message IDs to avoid duplicates
        const existingIds = myMessages?.messages?.map((msg) => msg.id || "") || []

        newSocket.emit("syncMessages", {
          roomId,
          since: lastSync,
          existingIds: existingIds
        })

        lastSyncTimeRef.current = Date.now()
      }
    })

    // Handle server errors
    newSocket.on("error", (data) => {
      console.error("Socket error:", data)
      handleShowToast(data.message || "An error occurred", "error")
    })

    // Handle new messages from socket
    newSocket.on("newMessage", (data) => {
      console.log("Received message via socket:", data)

      // Skip if no message data
      if (!data?.message) {
        console.warn("Received malformed message data:", data)
        return
      }

      // Generate a consistent ID if one wasn't provided
      let messageId = data.message.id
      if (!messageId) {
        messageId = generateMessageId(
          data.message.sender.username,
          data.message.text,
          data.message.date || Date.now()
        )
        data.message.id = messageId
      }

      // Skip processing if we've already seen this message
      if (processedMessagesRef.current.has(messageId)) {
        console.log(`Skipping already processed message ${messageId}`)
        return
      }

      // Mark as processed to avoid duplicates
      processedMessagesRef.current.add(messageId)

      // Add to Redux store
      dispatch(
        sendMessage({
          sender: data.message.sender,
          text: data.message.text,
          roomId: data.roomId,
          messageImageHref: data.message.messageImageHref,
          date: data.message.date,
          id: messageId,
          pending: data.message.pending || false // Track if message is still pending
        } as SendMessagePayload)
      )

      // Scroll to bottom on new message
      setTimeout(() => {
        const messagesContainer = document.querySelector(".overflow-y-auto")
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight
        }
      }, 50)
    })

    // Handle synced messages (batch of messages)
    newSocket.on("syncedMessages", (data) => {
      console.log(`Received ${data.messages?.length || 0} synced messages for room ${data.roomId}`)

      if (data.roomId !== roomId || !data.messages?.length) return

      // Process each message in the sync batch
      data.messages.forEach((message: ChatType & { id?: string }) => {
        // Skip messages we've already processed
        if (message.id && processedMessagesRef.current.has(message.id)) {
          console.log(`Skipping already processed synced message ${message.id}`)
          return
        }

        // Add the message to Redux
        const messageId =
          message.id ||
          generateMessageId(message.sender.username, message.text, message.date || Date.now())

        processedMessagesRef.current.add(messageId)

        dispatch(
          sendMessage({
            sender: message.sender,
            text: message.text,
            roomId: data.roomId,
            messageImageHref: message.messageImageHref,
            date: message.date,
            id: messageId,
            pending: false
          } as SendMessagePayload)
        )
      })

      // Update last sync time
      lastSyncTimeRef.current = Date.now()
    })

    // Listen for messages persisted notification
    newSocket.on("messagesPersisted", (data) => {
      if (data.roomId === roomId) {
        console.log("Messages have been persisted on server")

        // Remove any pending flags for messages in this room
        Object.keys(locallyAddedMessagesRef.current).forEach((msgId) => {
          if (pendingMessagesRef.current.has(msgId)) {
            pendingMessagesRef.current.delete(msgId)

            // Update the message to mark as not pending
            dispatch(
              sendMessage({
                ...locallyAddedMessagesRef.current[msgId],
                pending: false
              })
            )
          }
        })
      }
    })

    // Handle message updates (like image uploads completing)
    newSocket.on("messageUpdated", (data) => {
      console.log("Message updated:", data)
      if (data.roomId === roomId && roomId) {
        // Instead of refreshing all messages, we could optimize this later
        // to just update the specific message in the Redux store
        dispatch(fetchConversationMessages(roomId))
      }
    })

    // If this is a group chat, join the room
    if (myMessages.isGroup && roomId) {
      newSocket.emit("joinRoom", roomId)
    }

    // Load conversation messages from database to ensure we have all messages
    if (roomId) {
      dispatch(fetchConversationMessages(roomId))
    }

    // Cleanup
    return () => {
      if (myMessages.isGroup && roomId) {
        newSocket.emit("leaveRoom", roomId)
      }
      newSocket.disconnect()
      socketRef.current = null
      // Clear processed message tracking on unmount
      processedMessagesRef.current.clear()
      pendingMessagesRef.current.clear()
    }
  }, [roomId, myAccount?.username, myMessages.isGroup, dispatch])

  const handleSendMessage = async () => {
    if (!messageText.trim() && !selectedImage) return
    if (!myAccount || !roomId) return

    // Store current values to avoid race conditions
    const currentText = messageText.trim()
    const currentImage = selectedImage

    // Prevent duplicate sends by disabling sending state
    if (isMessageSending) return
    setIsMessageSending(true)

    // Clear input immediately for better UX
    setMessageText("")
    setSelectedImage(undefined)
    setIsEmojiPickerOpen(false)

    // Generate a consistent message ID using timestamp for client-side
    const messageDate = Date.now()
    const messageId = generateMessageId(myAccount.username, currentText, messageDate)

    // Add to processed messages immediately to prevent duplication
    processedMessagesRef.current.add(messageId)
    pendingMessagesRef.current.add(messageId)

    let messageImageHref: string | undefined = undefined

    try {
      // Create the message object once and reuse it to ensure consistency
      const messageObj = {
        sender: myAccount,
        text: currentText,
        roomId,
        messageImageHref: undefined, // We'll update this later if we have an image
        date: messageDate,
        id: messageId,
        pending: true // Mark as pending initially
      }

      // Store in local ref to track it
      locallyAddedMessagesRef.current[messageId] = messageObj

      // First update local state so the message appears immediately
      dispatch(sendMessage(messageObj))

      // Scroll to bottom immediately after adding the message
      setTimeout(() => {
        const messagesContainer = document.querySelector(".overflow-y-auto")
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight
        }
      }, 50)

      // Determine send strategy based on connection state
      const isSocketConnected = socketRef.current && socketConnected

      // If socket is connected, send via socket first for real-time delivery
      if (isSocketConnected) {
        console.log("Sending message via socket first (connected)")
        socketRef.current?.emit("sendMessage", {
          roomId,
          message: {
            sender: myAccount,
            text: currentText,
            messageImageHref: undefined, // No image yet
            date: messageDate,
            id: messageId,
            pending: true, // Flag that this message might be updated
            fromAPI: false // Flag this didn't come from the API
          },
          isGroup: myMessages.isGroup
        })
      } else {
        console.log("Socket not connected, will send via API only")
      }

      // Handle image upload in parallel
      if (currentImage) {
        try {
          // Upload image to backend
          const response = await messagesApi.uploadMessageImage(currentImage)
          messageImageHref = response.url || response.messageImageHref

          // Update the message with the image URL
          if (messageImageHref) {
            const updatedMessageObj = {
              ...messageObj,
              messageImageHref
            }

            // Update local ref
            locallyAddedMessagesRef.current[messageId] = updatedMessageObj

            // Update the message in Redux
            dispatch(sendMessage(updatedMessageObj))

            // Update via socket that image is now available (if connected)
            if (socketRef.current && socketConnected) {
              socketRef.current.emit("updateMessage", {
                roomId,
                messageId: messageId,
                updates: {
                  messageImageHref,
                  pending: true // Still pending until API confirms
                }
              })
            }
          }
        } catch (error) {
          console.error("Failed to upload image:", error)
        }
      }

      // Create message object for API
      const messageData = {
        sender: myAccount,
        text: currentText,
        roomId,
        messageImageHref,
        id: messageId // IMPORTANT: Always include the same ID to prevent duplication
      }

      // Always send to API for persistence, regardless of socket state
      console.log("Sending message via API for persistence, ID:", messageId)
      await dispatch(sendMessageAsync(messageData))
        .then((result) => {
          console.log("Message persisted via API:", result)

          // Mark as not pending in our tracking
          pendingMessagesRef.current.delete(messageId)

          // If API call succeeded but socket didn't receive it, update socket
          if (socketRef.current && socketConnected) {
            // Only update the message status, don't resend the whole message
            socketRef.current.emit("updateMessage", {
              roomId,
              messageId: messageId,
              updates: {
                pending: false
              }
            })

            console.log("Updated message pending status via socket")
          }

          // Update local reference
          if (locallyAddedMessagesRef.current[messageId]) {
            locallyAddedMessagesRef.current[messageId].pending = false
          }

          // Update message in Redux store to mark as not pending
          dispatch(
            sendMessage({
              sender: myAccount,
              text: currentText,
              roomId,
              messageImageHref,
              date: messageDate,
              id: messageId,
              pending: false
            })
          )
        })
        .catch((error) => {
          console.error("Failed to persist message:", error)

          // If API failed but socket is connected, try sending the complete message via socket
          if (socketRef.current && socketConnected && !isSocketConnected) {
            console.log("API failed, sending complete message via socket as fallback")
            socketRef.current.emit("sendMessage", {
              roomId,
              message: {
                sender: myAccount,
                text: currentText,
                messageImageHref: messageImageHref,
                date: messageDate,
                id: messageId,
                pending: false
              },
              isGroup: myMessages.isGroup
            })
          }

          // Mark as not pending but with error
          if (locallyAddedMessagesRef.current[messageId]) {
            locallyAddedMessagesRef.current[messageId].pending = false
            locallyAddedMessagesRef.current[messageId].error = true
          }

          // Update message in Redux store to indicate error
          dispatch(
            sendMessage({
              sender: myAccount,
              text: currentText,
              roomId,
              messageImageHref,
              date: messageDate,
              id: messageId,
              pending: false,
              error: true
            })
          )
        })
    } catch (error) {
      console.error("Error in send message flow:", error)
    } finally {
      setIsMessageSending(false)
    }
  }

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImage(e.target.files[0])
    }
  }

  const handleChangeMessageText = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(event.target.value)

    // Emit typing indicator via socket
    if (socketRef.current && socketConnected && roomId) {
      socketRef.current.emit("typing", {
        roomId,
        isTyping: true
      })

      // Clear typing indicator after 2 seconds of inactivity
      setTimeout(() => {
        if (socketRef.current && socketConnected) {
          socketRef.current.emit("typing", {
            roomId,
            isTyping: false
          })
        }
      }, 2000)
    }
  }

  const handleToggleEmojiPicker = () => {
    setIsEmojiPickerOpen((prev) => !prev)
  }

  const handleSelectEmoji = (emoji: string) => {
    setMessageText((prev) => prev + emoji)
  }

  const handleBlurEmojiPicker = () => {
    setIsEmojiPickerOpen(false)
  }

  return (
    <>
      <div className="h-screen md:flex-1 flex flex-col bg-gray-100 dark:bg-gray-900 md:relative md:w-auto fixed w-full inset-0">
        {/* Header */}
        <div className="sticky top-0 left-0 right-0 z-20 bg-gray-100 dark:bg-gray-900 shadow-md">
          <MessageRoomTopBar myMessages={myMessages} onBack={onBack} />
        </div>

        {/* Messages container - increased padding for mobile */}
        <div className="flex-1 overflow-y-auto pb-48 md:pb-24">
          <MessageRoomMessages
            isGroup={myMessages.isGroup}
            messages={myMessages.messages}
            handleBlurEmojiPicker={handleBlurEmojiPicker}
          />
        </div>

        <div className="md:sticky md:bottom-0 md:left-0 md:right-0 md:w-auto fixed bottom-16 left-0 right-0 w-full z-30 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="md:hidden fixed left-0 right-0 h-16 bottom-0 bg-gray-100 dark:bg-gray-900 z-20"></div>
          <MessageRoomInput
            messageText={messageText}
            isEmojiPickerOpen={isEmojiPickerOpen}
            selectedImage={selectedImage}
            handleChangeMessageText={handleChangeMessageText}
            handleSelectEmoji={handleSelectEmoji}
            handleSendMessage={handleSendMessage}
            handleToggleEmojiPicker={handleToggleEmojiPicker}
            handleChangeImage={handleChangeImage}
            isMessageSending={isMessageSending}
          />
        </div>
      </div>

      {/* Add toast container */}
      <ToastContainer showToast={showToast} toastContent={toastContent} toastType={toastType} />
    </>
  )
}
