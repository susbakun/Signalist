import { appwriteEndpoint, appwriteMessagesBucketId, appwriteProjectId } from "@/shared/constants"
import { MessageModel } from "@/shared/models"
import { GroupInfoType, SimplifiedAccountType } from "@/shared/types"
import { Client, ImageFormat, ImageGravity, Storage } from "appwrite"
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
        (isGroupRoom(messages[messageId]) &&
          messages[messageId].groupInfo!.groupName === groupName) ||
        (!isGroupRoom(messages[messageId]) &&
          messages[messageId].userInfo!.username === user?.username)
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

    const client = new Client()
    client.setEndpoint(appwriteEndpoint).setProject(appwriteProjectId)
    const storage = new Storage(client)

    if (userInfo) {
      imageUrl = userInfo.imageUrl
      imageAlt = userInfo.name
    } else if (groupInfo) {
      if (groupInfo.groupImageId) {
        const result = storage.getFilePreview(
          appwriteMessagesBucketId,
          groupInfo.groupImageId,
          0,
          0,
          ImageGravity.Center,
          100,
          0,
          "fff",
          0,
          1,
          0,
          "fff",
          ImageFormat.Png
        )
        imageUrl = result.href
      }
      imageAlt = groupInfo.groupName
    }

    if (imageUrl) {
      return (
        <img src={imageUrl} alt={`${imageAlt}'s avatar`} className="mr-3 w-14 h-14 rounded-full" />
      )
    }
    return (
      <div
        className="p-2 rounded-full w-fit h-fit mr-3
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

  const isGroupRoom = (messages: MessageModel["username"]["roomId"]) => {
    return messages.groupInfo && messages.usersInfo && messages.isGroup
  }

  return { checkIfExistsRoom, findExistingRoomId, getProperAvatar, isGroupRoom }
}
