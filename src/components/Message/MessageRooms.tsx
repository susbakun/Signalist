import { CreateMessageModal } from '@/components'
import { MessageModel } from '@/shared/models'
import { SimplifiedAccountType } from '@/shared/types'
import { getAvatarPlaceholder } from '@/utils'
import Tippy from '@tippyjs/react'
import { Avatar } from 'flowbite-react'
import { useState } from 'react'
import { TbMessagePlus } from 'react-icons/tb'
import { Link } from 'react-router-dom'
import { roundArrow } from 'tippy.js'

type MessageRoomsProps = {
  myMessages: MessageModel['']
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
      myMessages[messageId]['messages'][myMessages[messageId]['messages'].length - 1]
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
      <div className="w-1/3 bg-gray-200/80 dark:bg-gray-800 p-4 overflow-y-auto">
        <div className="flex justify-between mb-4 items-center">
          <h2 className="text-2xl font-bold">Chats</h2>
          <Tippy
            content="New message"
            className="dark:bg-gray-900 bg-gray-900 text-white font-sans
            rounded-md px-1 py-[2px] text-sm"
            delay={[1000, 0]}
            placement="bottom-end"
            animation="fade"
            arrow={roundArrow}
            offset={[0, 8]}
            duration={10}
            hideOnClick={true}
          >
            <button onClick={handleOpenCreateMessageModal} className="action-button">
              <TbMessagePlus className="w-7 h-7" />
            </button>
          </Tippy>
        </div>
        {messagesIds.map((messageId) => {
          const { placeholder, text, userInfo } = getMessageInfo(messageId)
          return (
            <Link
              key={messageId}
              className="flex items-center p-3 mb-3 bg-white
          dark:bg-gray-700 rounded-xl cursor-pointer hover:dark:bg-gray-600
          hover:bg-gray-300"
              to={messageId}
            >
              {getDesiredUserAvatar(userInfo, placeholder)}
              <div>
                <h3 className="text-lg font-semibold">{userInfo.username}</h3>
                {text && <p className="text-gray-400">{text}</p>}
              </div>
            </Link>
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
