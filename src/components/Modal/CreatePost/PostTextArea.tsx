import { ChangeEvent, KeyboardEvent } from "react"

type PostTextAreaProps = {
  postText: string
  handleKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void
  handlePostTextChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

export const PostTextArea = ({
  postText,
  handleKeyDown,
  handlePostTextChange
}: PostTextAreaProps) => {
  return (
    <div
      className="h-[25vh] mobile:h-[20vh] dark:bg-gray-600
      w-full flex justify-center px-2 mobile:px-1
    bg-gray-200 rounded-lg"
    >
      <textarea
        value={postText}
        onChange={handlePostTextChange}
        onKeyDown={handleKeyDown}
        autoFocus
        placeholder="Add a text..."
        className="resize-none border-none outline-none
      dark:bg-gray-600 w-full h-full bg-gray-200 rounded-lg mobile:text-sm"
      ></textarea>
    </div>
  )
}
