import axios from "axios"
import { SimplifiedAccountType } from "@/shared/types"
import { backendUrl } from "@/shared/constants"

const API_MESSAGES_URL = `${backendUrl}/messages`

/**
 * Get all conversations for a user
 * @param username - The username to get conversations for
 */
export const getUserConversations = async (username: string) => {
  const response = await axios.get(`${API_MESSAGES_URL}/user/${username}`)
  return response.data.conversations
}

/**
 * Get messages for a specific conversation
 * @param roomId - The room ID to get messages for
 */
export const getConversationMessages = async (roomId: string) => {
  const response = await axios.get(`${API_MESSAGES_URL}/conversation/${roomId}`)
  return response.data.messages
}

/**
 * Send a message to a conversation
 * @param roomId - The room ID to send the message to
 * @param sender - The sender information
 * @param text - The message text
 * @param messageImageHref - Optional image URL for the message
 */
export const sendMessage = async (
  roomId: string,
  sender: SimplifiedAccountType,
  text: string,
  messageImageHref?: string
) => {
  const response = await axios.post(`${API_MESSAGES_URL}/conversation/${roomId}`, {
    sender,
    text,
    messageImageHref
  })
  return response.data.message
}

/**
 * Create a new direct message conversation
 * @param user1 - The first user in the conversation
 * @param user2 - The second user in the conversation
 */
export const createDMConversation = async (
  user1: SimplifiedAccountType,
  user2: SimplifiedAccountType
) => {
  const response = await axios.post(`${API_MESSAGES_URL}/dm`, { user1, user2 })
  return response.data
}

/**
 * Create a new group conversation
 * @param groupName - The name of the group
 * @param members - The members of the group
 * @param createdBy - The user who created the group
 */
export const createGroupConversation = async (
  groupName: string,
  members: SimplifiedAccountType[],
  createdBy: SimplifiedAccountType
) => {
  const response = await axios.post(`${API_MESSAGES_URL}/group`, {
    groupName,
    members,
    createdBy
  })
  return response.data
}

/**
 * Upload an image for a message or group
 * @param file - The image file to upload
 * @returns An object containing messageImageHref that can be used to access the image
 */
export const uploadMessageImage = async (file: File) => {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await fetch("https://signalist-backend.liara.run/api/upload/messages", {
      method: "POST",
      body: formData
    })

    const data = await response.json()
    return {
      url: data.url,
      messageImageHref: data.url
    }
  } catch (error) {
    console.error("Failed to upload image:", error)
    throw error
  }
}

/**
 * Get the URL for a message or group image
 * @param imageId - The ID of the image to retrieve
 * @returns The complete URL to access the image from the backend
 */
export const getMessageImageUrl = (imageId: string) => {
  return `${API_MESSAGES_URL}/image/${imageId}`
}
