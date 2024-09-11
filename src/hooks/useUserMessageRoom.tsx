import { MessageModel } from "@/shared/models"
import { GroupInfoType, SimplifiedAccountType } from "@/shared/types"
import { Avatar } from "flowbite-react"

export const useUserMessageRoom = () => {
  const checkIfExistsRoom = (
    messages: MessageModel["username"],
    user?: SimplifiedAccountType,
    groupName?: string
  ) => {
    if (findExistingRoomId(messages, user, groupName)) return true
    return false
  }

  const findExistingRoomId = (
    messages: MessageModel["username"],
    user?: SimplifiedAccountType,
    groupName?: string
  ) => {
    return Object.keys(messages).find((messageId) => {
      if (
        (messages[messageId].isGroup &&
          messages[messageId].groupInfo &&
          messages[messageId].groupInfo.groupName === groupName) ||
        (!messages[messageId].isGroup &&
          messages[messageId].userInfo &&
          messages[messageId].userInfo.username === user?.username)
      ) {
        return messageId
      }
    })
  }

  const getProperAvatar = (
    placeholder: string,
    userInfo?: SimplifiedAccountType,
    groupInfo?: GroupInfoType
  ) => {
    let imageUrl
    let imageAlt

    if (userInfo) {
      imageUrl = userInfo.imageUrl
      imageAlt = userInfo.name
    } else if (groupInfo) {
      imageUrl = groupInfo.groupImageUrl
      imageAlt = groupInfo.groupName
    }

    if (imageUrl) {
      return (
        <img src={imageUrl} alt={`${imageAlt}'s avatar`} className="mr-3 w-14 h-14 rounded-full" />
      )
    }
    return (
      <div
        className="p-2 rounded-full w-fit mr-3
      bg-gray-100 dark:bg-gray-600 flex justify-center"
      >
        <Avatar
          img={imageUrl}
          alt={`${imageAlt}'s avatar`}
          placeholderInitials={placeholder}
          size="md"
          rounded
        />
      </div>
    )
  }

  return { checkIfExistsRoom, findExistingRoomId, getProperAvatar }
}
