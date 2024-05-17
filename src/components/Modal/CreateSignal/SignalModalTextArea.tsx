import { SignalModel } from '@/shared/models'
import { ChangeEvent } from 'react'

type SignalModalTextAreaProps = {
  descriptionText: SignalModel['description']
  handleDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

export const SignalModalTextArea = ({
  descriptionText,
  handleDescriptionChange
}: SignalModalTextAreaProps) => {
  return (
    <div>
      <textarea
        value={descriptionText}
        onChange={handleDescriptionChange}
        placeholder="Add a text..."
        className="resize-none border-none outline-none
                    w-full h-[150px] dark:bg-gray-700 bg-gray-300 rounded-md"
      ></textarea>
    </div>
  )
}
