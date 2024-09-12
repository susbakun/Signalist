import { CreateGroupModal, CreateMessageModal, MessageRoomsTopBar } from "@/components"
import { useAppSelector } from "@/features/Message/messagesSlice"
import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"
import { useUserMessageRoom } from "@/hooks/useUserMessageRoom"
import { MessageModel } from "@/shared/models"
import { getAvatarPlaceholder, isGroupRoom } from "@/utils"
import { useState } from "react"
import { RiGroupLine } from "react-icons/ri"
import { NavLink } from "react-router-dom"

type MessageRoomsProps = {
  myMessages: MessageModel["username"]
}

export const MessageRooms = ({ myMessages }: MessageRoomsProps) => {
  const [showCreateMessageModal, setShowCreateMessageModal] = useState(false)
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)

  const messagesIds = Object.keys(myMessages)

  const handleOpenCreateMessageModal = () => {
    setShowCreateMessageModal(true)
  }

  const handleCloseCreateMessageModal = () => {
    setShowCreateMessageModal(false)
  }

  const handleOpenCreateGroupModal = () => {
    setShowCreateGroupModal(true)
  }

  const handleCloseCreateGroupModal = () => {
    setShowCreateGroupModal(false)
  }

  const myAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === "Amir_Aryan"
  )

  const { isUserBlocked } = useIsUserBlocked(myAccount)
  const { getProperAvatar } = useUserMessageRoom()

  const getMessageInfo = (messageId: string) => {
    const lastMessage =
      myMessages[messageId]["messages"][myMessages[messageId]["messages"].length - 1]

    let placeholder

    if (isGroupRoom(myMessages[messageId])) {
      placeholder = getAvatarPlaceholder(myMessages[messageId].groupInfo.groupName)
    } else {
      placeholder = getAvatarPlaceholder(myMessages[messageId].userInfo.name)
    }

    let text
    if (lastMessage) {
      text = lastMessage.text
    }

    return { placeholder, text }
  }

  return (
    <>
      <div
        className="xl:w-[25%] lg:w-[30%] bg-gray-200/80
        dark:bg-gray-800 p-4 overflow-y-auto"
      >
        <MessageRoomsTopBar
          handleOpenCreateGroupModal={handleOpenCreateGroupModal}
          handleOpenCreateMessageModal={handleOpenCreateMessageModal}
        />
        {messagesIds.map((messageId) => {
          const { placeholder, text } = getMessageInfo(messageId)

          if (
            (isGroupRoom(myMessages[messageId]) &&
              myMessages[messageId].usersInfo.some((user) => isUserBlocked(user.username))) ||
            (!isGroupRoom(myMessages[messageId]) &&
              isUserBlocked(myMessages[messageId].userInfo.username))
          )
            return

          return (
            <NavLink
              key={messageId}
              className="flex items-center p-3 mb-3 bg-white overflow-hidden
            dark:bg-gray-700 rounded-xl cursor-pointer messageRooms justify-between"
              to={messageId}
            >
              <div className="flex items-center">
                {isGroupRoom(myMessages[messageId])
                  ? getProperAvatar(placeholder, undefined, myMessages[messageId].groupInfo)
                  : getProperAvatar(placeholder, myMessages[messageId].userInfo, undefined)}
                <div>
                  <h3 className="text-lg font-semibold">
                    {isGroupRoom(myMessages[messageId])
                      ? myMessages[messageId].groupInfo.groupName
                      : myMessages[messageId].userInfo.username}
                  </h3>
                  {text && (
                    <p className="text-gray-400 text-ellipsis max-w-[215px] overflow-hidden whitespace-nowrap">
                      {text}
                    </p>
                  )}
                </div>
              </div>
              {myMessages[messageId].isGroup && (
                <div>
                  <RiGroupLine className="w-5 h-5" />
                </div>
              )}
            </NavLink>
          )
        })}
      </div>
      <CreateMessageModal
        openModal={showCreateMessageModal}
        handleCloseModal={handleCloseCreateMessageModal}
        myMessages={myMessages}
      />
      <CreateGroupModal
        openModal={showCreateGroupModal}
        closeModal={handleCloseCreateGroupModal}
        myMessages={myMessages}
      />
    </>
  )
}
