import { MessageRooms } from '@/components'
import { useAppSelector } from '@/features/Message/messagesSlice'
import { useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'

export const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState<null | string>(null)

  const myMessages = useAppSelector((state) => state.messages['Amir_Aryan'])

  const { id } = useParams()

  useEffect(() => {
    if (id) {
      setSelectedChat(id)
    }
  }, [id])

  return (
    <div
      className="flex h-screen bg-primary-main dark:bg-[#101827] text-gray-600
    dark:text-gray-100"
    >
      <MessageRooms myMessages={myMessages} />
      <div className="w-2/3 bg-gray-100 dark:bg-gray-900 p-4 flex flex-col">
        {selectedChat ? (
          <Outlet
            context={{
              messages: myMessages[selectedChat].messages,
              userInfo: myMessages[selectedChat].userInfo
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}
