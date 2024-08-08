import { CreateMessageModal, MessageRoomsTopBar } from "@/components"
import { useAppSelector } from "@/features/Message/messagesSlice"
import { userIsUserBlocked } from "@/hooks/userIsUserBlocked"
import { MessageModel } from "@/shared/models"
import { SimplifiedAccountType } from "@/shared/types"
import { getAvatarPlaceholder } from "@/utils"
import { Avatar } from "flowbite-react"
import { useState } from "react"
import { NavLink } from "react-router-dom"

type MessageRoomsProps = {
  myMessages: MessageModel[""]
}

export const MessageRooms = ({ myMessages }: MessageRoomsProps) => {
  const [showCreateMessageModal, setShowCreateMessageModal] = useState(false)

  const messagesIds = Object.keys(myMessages)

  const handleOpenCreateMessageModal = () => {
    setShowCreateMessageModal(true)
  }

  const handleCloseCreateMessageModal = () => {
    setShowCreateMessageModal(false)
  }

  const myAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === "Amir_Aryan"
  )

  const { isUserBlocked } = userIsUserBlocked(myAccount)

  const getDesiredUserAvatar = (userInfo: SimplifiedAccountType, placeholder?: string) => {
    if (userInfo.imageUrl) {
      return (
        <img
          src={userInfo.imageUrl}
          alt={`${userInfo.name}'s avatar`}
          className="mr-3 w-14 h-14 rounded-full"
        />
      )
    }
    return (
      <div
        className="p-2 rounded-full w-fit mr-3
      bg-gray-100 dark:bg-gray-600 flex justify-center"
      >
        <Avatar
          img={userInfo.imageUrl}
          alt={`${userInfo.name}'s avatar`}
          placeholderInitials={placeholder}
          size="md"
          rounded
        />
      </div>
    )
  }

  const getMessageInfo = (messageId: string) => {
    const lastMessage =
      myMessages[messageId]["messages"][myMessages[messageId]["messages"].length - 1]
    const { userInfo } = myMessages[messageId]
    const placeholder = getAvatarPlaceholder(userInfo.name)
    let text
    if (lastMessage) {
      text = lastMessage.text
    }
    return { placeholder, text, userInfo }
  }

  return (
    <>
      <div className="xl:w-[25%] lg:w-[30%] bg-gray-200/80 dark:bg-gray-800 p-4 overflow-y-auto">
        <MessageRoomsTopBar handleOpenCreateMessageModal={handleOpenCreateMessageModal} />
        {messagesIds.map((messageId) => {
          const { placeholder, text, userInfo } = getMessageInfo(messageId)
          if (isUserBlocked(userInfo.username)) return
          return (
            <NavLink
              key={messageId}
              className="flex items-center p-3 mb-3 bg-white
            dark:bg-gray-700 rounded-xl cursor-pointer messageRooms"
              to={messageId}
            >
              {getDesiredUserAvatar(userInfo, placeholder)}
              <div>
                <h3 className="text-lg font-semibold">{userInfo.username}</h3>
                {text && <p className="text-gray-400">{text}</p>}
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
    </>
  )
}
