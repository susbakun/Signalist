import { CustomAvatar } from "@/components"
import { MessageModel } from "@/shared/models"
import { GroupInfoType, SimplifiedAccountType } from "@/shared/types"

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

  /**
   * Check if a group has a valid image ID
   * @param groupInfo - The group info object
   * @returns true if the group has a valid image ID, false otherwise
   */
  const hasValidGroupImage = (groupInfo?: GroupInfoType) => {
    return !!groupInfo && !!groupInfo.groupImageHref
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
      if (hasValidGroupImage(groupInfo)) {
        imageUrl = groupInfo.groupImageHref
      }
      imageAlt = groupInfo.groupName
    }

    if (imageUrl) {
      return (
        <div className="mr-3 flex-shrink-0">
          <CustomAvatar
            img={imageUrl}
            alt={`${imageAlt}'s avatar`}
            placeholderInitials={placeholder}
            size="md"
            rounded
            wrapperClassName="w-14 h-14 flex items-center justify-center"
            className="text-xl font-semibold"
          />
        </div>
      )
    }

    return (
      <div
        className="p-2 rounded-full w-fit h-fit mr-3
    bg-gray-100 dark:bg-gray-600 flex justify-center"
      >
        <CustomAvatar
          placeholderInitials={placeholder}
          size="md"
          wrapperClassName="w-10 h-10"
          rounded
        />
      </div>
    )
  }

  const isGroupRoom = (messages: MessageModel["username"]["roomId"]) => {
    return messages.groupInfo && messages.usersInfo && messages.isGroup
  }

  return { checkIfExistsRoom, findExistingRoomId, getProperAvatar, isGroupRoom, hasValidGroupImage }
}
