import { MessageRooms } from "@/components"
import { useAppSelector } from "@/features/Message/messagesSlice"
import { getCurrentUsername } from "@/utils"
import { useEffect, useState } from "react"
import { Outlet, useParams } from "react-router-dom"

export const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState<null | string>(null)

  const currentUsername = getCurrentUsername()
  const myMessages = useAppSelector((state) => state.messages)[currentUsername]

  const { id } = useParams()

  useEffect(() => {
    if (id) {
      setSelectedChat(id)
    }
  }, [id])

  return (
    <div className="flex h-screen bg-primary-main dark:bg-[#101827] text-gray-600 dark:text-gray-100">
      <div
        className={`${selectedChat ? "hidden md:block" : "block"} md:w-[35%] lg:w-[30%] xl:w-[25%] w-full h-full overflow-y-auto border-r border-gray-200 dark:border-gray-700`}
      >
        <MessageRooms myMessages={myMessages} />
      </div>
      <div
        className={`bg-gray-100 dark:bg-gray-900 flex flex-col ${selectedChat ? "block" : "hidden"} md:block md:w-[65%] lg:w-[70%] xl:w-[75%] w-full max-h-full overflow-y-hidden`}
      >
        {selectedChat ? (
          <Outlet
            context={{
              myMessages: myMessages[selectedChat],
              onBack: () => setSelectedChat(null)
            }}
          />
        ) : (
          <div className="hidden md:flex items-center justify-center h-full">
            <p className="text-gray-400">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}
