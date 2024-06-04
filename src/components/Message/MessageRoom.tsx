import { sendMessage, useAppSelector } from '@/features/Message/messagesSlice'
import { ChatType, SimplifiedAccountType } from '@/shared/types'
import { cn } from '@/utils'
import EmojiPicker from 'emoji-picker-react'
import moment from 'jalali-moment'
import { ChangeEvent, useState } from 'react'
import { BsEmojiGrin } from 'react-icons/bs'
import { useDispatch } from 'react-redux'
import { useOutletContext, useParams } from 'react-router-dom'

type MessageRoomOutletType = {
  messages: ChatType[]
  userInfo: SimplifiedAccountType
}

export const MessageRoom = () => {
  const { messages, userInfo } = useOutletContext<MessageRoomOutletType>()
  const [messageText, setMessageText] = useState('')
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)

  const dispatch = useDispatch()

  const { id } = useParams()

  const myAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === 'Amir_Aryan'
  )

  const handleFocusOrBlurInput = () => {
    setIsInputFocused((prev) => !prev)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

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

  const handleBlurEmojiPicker = () => {
    setIsEmojiPickerOpen(false)
  }

  const handleSelectEmoji = (emoji: string) => {
    setMessageText((prev) => prev + emoji)
  }

  const formatMessageDate = (date: number) => {
    return moment(date).calendar(undefined, {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      lastDay: '[Yesterday]',
      lastWeek: '[Last] dddd',
      sameElse: 'MMM D, YYYY'
    })
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">{userInfo.name}</h2>
      <div onClick={handleBlurEmojiPicker} className="flex-grow overflow-y-auto space-y-4">
        {messages.reduce((acc: JSX.Element[], message, index) => {
          const messageDate = formatMessageDate(message.date)
          const prevMessageDate = index > 0 ? formatMessageDate(messages[index - 1].date) : null

          if (messageDate !== prevMessageDate) {
            acc.push(
              <div
                key={`date-${messageDate}`}
                className="text-center text-gray-500 dark:text-gray-400 my-2"
              >
                {messageDate}
              </div>
            )
          }

          acc.push(
            <div
              key={index}
              className={`flex ${message.sender.username === 'Amir_Aryan' ? 'justify-end' : 'justify-start'} items-center`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  message.sender.username === 'Amir_Aryan'
                    ? 'bg-primary-link-button dark:bg-dark-link-button text-white'
                    : 'dark:bg-gray-700 bg-gray-200 text-gray-600 dark:text-gray-100'
                }`}
              >
                <p>{message.text}</p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                {moment(message.date).format('h:mm A')}
              </span>
            </div>
          )
          return acc
        }, [])}
      </div>
      <div className="relative">
        <EmojiPicker
          open={isEmojiPickerOpen}
          onEmojiClick={(e) => handleSelectEmoji(e.emoji)}
          width={350}
          height={400}
          style={{ position: 'absolute', bottom: '0px' }}
        />
      </div>
      <div
        className={cn(
          'mt-4 flex px-3 py-0 h-12 w-full rounded-2xl border-2',
          'bg-gray-200 dark:bg-gray-800 text-gray-600',
          'dark:text-gray-100 justify-center items-center',
          'border-transparent',
          { 'border-primary-link-button': isInputFocused },
          { 'dark:border-dark-link-button': isInputFocused }
        )}
      >
        <button
          onClick={handleToggleEmojiPicker}
          className={cn(
            'mr-1',
            { 'dark:text-dark-link-button': isEmojiPickerOpen },
            { 'text-primary-link-button': isEmojiPickerOpen }
          )}
        >
          <BsEmojiGrin className="w-5 h-5" />
        </button>
        <textarea
          value={messageText}
          onChange={handleChangeMessageText}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="w-full px-1 pt-[9px] bg-gray-200 dark:bg-gray-800
        dark:text-gray-100 placeholder-gray-500 text-gray-600
          border-none ring-0 focus:ring-0 resize-none h-full"
          onFocus={handleFocusOrBlurInput}
          onBlur={handleFocusOrBlurInput}
        ></textarea>
        <button onClick={handleSendMessage} className="text-primary-link-button py-0">
          Send
        </button>
      </div>
    </>
  )
}
