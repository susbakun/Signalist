import { CreateGroupModal, CreateMessageModal, MessageRoomsTopBar } from "@/components"
import { useAppSelector } from "@/features/Message/messagesSlice"
import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"
import { useUserMessageRoom } from "@/hooks/useUserMessageRoom"
import { MessageModel } from "@/shared/models"
import { getAvatarPlaceholder, getCurrentUsername } from "@/utils"
import { useState } from "react"
import { RiGroupLine } from "react-icons/ri"
import { NavLink } from "react-router-dom"

type MessageRoomsProps = {
  myMessages: MessageModel["username"]
}

export const MessageRooms = ({ myMessages }: MessageRoomsProps) => {
  const [showCreateMessageModal, setShowCreateMessageModal] = useState(false)
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)

  const messagesIds = myMessages ? Object.keys(myMessages) : []

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

  const currentUsername = getCurrentUsername()
  const myAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === currentUsername
  )

  const { isUserBlocked } = useIsUserBlocked(myAccount)
  const { getProperAvatar, isGroupRoom } = useUserMessageRoom()

  const getMessageInfo = (messageId: string) => {
    if (!myMessages || !myMessages[messageId]) {
      return { placeholder: "", text: "" }
    }

    const lastMessage =
      myMessages[messageId]["messages"][myMessages[messageId]["messages"].length - 1]

    let placeholder

    if (isGroupRoom(myMessages[messageId])) {
      placeholder = getAvatarPlaceholder(myMessages[messageId].groupInfo!.groupName)
    } else {
      placeholder = getAvatarPlaceholder(myMessages[messageId].userInfo!.name)
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
        className="h-full bg-gray-200/80
        dark:bg-gray-800 p-6 overflow-y-auto"
      >
        <MessageRoomsTopBar
          handleOpenCreateGroupModal={handleOpenCreateGroupModal}
          handleOpenCreateMessageModal={handleOpenCreateMessageModal}
        />
        {myMessages &&
          messagesIds.map((messageId) => {
            const { placeholder, text } = getMessageInfo(messageId)

            if (
              (isGroupRoom(myMessages[messageId]) &&
                myMessages[messageId].usersInfo!.some((user) => isUserBlocked(user.username))) ||
              (!isGroupRoom(myMessages[messageId]) &&
                isUserBlocked(myMessages[messageId].userInfo!.username))
            )
              return null

            return (
              <NavLink
                key={messageId}
                className="flex items-center p-3 mb-3 bg-white overflow-hidden
            dark:bg-gray-700 rounded-xl cursor-pointer messageRooms max-w-full"
                to={messageId}
              >
                <div className="flex items-center flex-1 min-w-0">
                  {isGroupRoom(myMessages[messageId])
                    ? getProperAvatar(placeholder, undefined, myMessages[messageId].groupInfo!)
                    : getProperAvatar(placeholder, myMessages[messageId].userInfo!, undefined)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold truncate">
                        {isGroupRoom(myMessages[messageId])
                          ? myMessages[messageId].groupInfo!.groupName
                          : myMessages[messageId].userInfo!.username}
                      </h3>
                      {myMessages[messageId].isGroup && (
                        <div className="flex-shrink-0">
                          <RiGroupLine className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    {text && (
                      <p
                        className="text-gray-400 truncate max-w-full break-all overflow-hidden text-ellipsis whitespace-nowrap"
                        style={{ maxWidth: "280px" }}
                      >
                        {text}
                      </p>
                    )}
                  </div>
                </div>
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
