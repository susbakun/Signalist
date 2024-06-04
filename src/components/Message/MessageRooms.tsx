import { MessageModel } from '@/shared/models'
import { Link } from 'react-router-dom'

type MessageRoomsProps = {
  myMessages: MessageModel['']
}

export const MessageRooms = ({ myMessages }: MessageRoomsProps) => {
  const messagesIds = Object.keys(myMessages)
  return (
    <div className="w-1/3 bg-gray-200/80 dark:bg-gray-800 p-4 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Chats</h2>
      {messagesIds.map((messageId) => {
        const lastMessage =
          myMessages[messageId]['messages'][myMessages[messageId]['messages'].length - 1]
        const { userInfo } = myMessages[messageId]

        const { text } = lastMessage
        return (
          <Link
            key={messageId}
            className="flex items-center p-3 mb-3 bg-gray-100
          dark:bg-gray-700 rounded-xl cursor-pointer hover:dark:bg-gray-600
          hover:bg-gray-300"
            to={messageId}
          >
            <img
              src={userInfo.imageUrl}
              alt={`${userInfo.name}'s avatar`}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="text-lg font-semibold">{userInfo.username}</h3>
              <p className="text-gray-400">{text}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
