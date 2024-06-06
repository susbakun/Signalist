import { ChatType } from '@/shared/types'
import { formatMessageDate } from '@/utils'
import moment from 'jalali-moment'

type MessageRoomMessagesProps = {
  messages: ChatType[]
  handleBlurEmojiPicker: () => void
}

export const MessageRoomMessages = ({
  handleBlurEmojiPicker,
  messages
}: MessageRoomMessagesProps) => {
  return (
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
  )
}
