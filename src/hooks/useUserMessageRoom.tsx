import { AccountModel, MessageModel } from "@/shared/models"
import { Avatar } from "flowbite-react"

export const useUserMessageRoom = () => {
  const checkIfExistsRoom = (user: AccountModel, messages: MessageModel["username"]) => {
    return Object.keys(messages).some((messageId) => {
      if (messages[messageId].userInfo.username === user.username) {
        return true
      }
      return false
    })
  }
  const findExistingRoomId = (user: AccountModel, messages: MessageModel["username"]) => {
    return Object.keys(messages).find((messageId) => {
      if (messages[messageId].userInfo.username === user.username) {
        return messageId
      }
    })
  }

  const getDesiredUserAvatar = (
    userInfo: MessageModel["username"]["roomId"]["userInfo"],
    placeholder?: string
  ) => {
    const imageSrc = userInfo.imageUrl
    const imageAlt = userInfo.name

    if (imageSrc) {
      return (
        <img src={imageSrc} alt={`${imageAlt}'s avatar`} className="mr-3 w-14 h-14 rounded-full" />
      )
    }
    return (
      <div
        className="p-2 rounded-full w-fit mr-3
      bg-gray-100 dark:bg-gray-600 flex justify-center"
      >
        <Avatar
          img={imageSrc}
          alt={`${imageAlt}'s avatar`}
          placeholderInitials={placeholder}
          size="md"
          rounded
        />
      </div>
    )
  }

  return { checkIfExistsRoom, findExistingRoomId, getDesiredUserAvatar }
}
