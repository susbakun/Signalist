import { MessageRoomInput, MessageRoomMessages } from '@/components'
import { sendMessage, useAppSelector } from '@/features/Message/messagesSlice'
import { ChatType, SimplifiedAccountType } from '@/shared/types'
import { ChangeEvent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useOutletContext, useParams } from 'react-router-dom'

type MessageRoomOutletType = {
  messages: ChatType[]
  userInfo: SimplifiedAccountType
}

export const MessageRoom = () => {
  const [messageText, setMessageText] = useState('')
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  const myAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === 'Amir_Aryan'
  )

  const { messages, userInfo } = useOutletContext<MessageRoomOutletType>()
  const dispatch = useDispatch()
  const { id } = useParams()

  const handleSendMessage = () => {
    if (messageText.trim() === '') return
    setMessageText('')
    setIsEmojiPickerOpen(false)
    dispatch(sendMessage({ sender: myAccount, text: messageText, roomId: id }))
  }

  const handleChangeMessageText = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(event.target.value)
  }

  const handleToggleEmojiPicker = () => {
    setIsEmojiPickerOpen((prev) => !prev)
  }

  const handleSelectEmoji = (emoji: string) => {
    setMessageText((prev) => prev + emoji)
  }

  const handleBlurEmojiPicker = () => {
    setIsEmojiPickerOpen(false)
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">{userInfo.name}</h2>
      <MessageRoomMessages messages={messages} handleBlurEmojiPicker={handleBlurEmojiPicker} />
      <MessageRoomInput
        handleChangeMessageText={handleChangeMessageText}
        handleSelectEmoji={handleSelectEmoji}
        handleSendMessage={handleSendMessage}
        messageText={messageText}
        isEmojiPickerOpen={isEmojiPickerOpen}
        handleToggleEmojiPicker={handleToggleEmojiPicker}
      />
    </>
  )
}
